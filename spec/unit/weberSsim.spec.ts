import { Options } from "../../src/types";
import { average, mean2d, variance } from "../../src/math";
import { defaults } from "../../src/defaults";
import { ssim } from "../../src/index";
import { roundTo } from "../helpers/round";
import { samples, sampleCsv } from "../helpers/matrices";
import { windowSums, windowVariance } from "../../src/weberSsim";
import { sub } from "../../src/matlab";

describe("weberSsim", () => {
  let options: Options;
  let k0Options: Options;

  beforeEach(() => {
    options = { ...defaults, ssim: "weber" };
    k0Options = { ...defaults, ssim: "weber", k1: 0, k2: 0 };
  });

  test("should return same results than Webers's implementation", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const ssimMap = ssim(A, B, options).ssim_map;
    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.95765);
  });

  test("rolling ssim mssim should be the same as mean2d ssim", () => {
    const A = sampleCsv.lena;
    const B = sampleCsv.lena02876;
    const { ssim_map: ssimMap, mssim } = ssim(A, B, options);
    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.99299);
    expect(roundTo(mssim, 5)).toBe(0.99299);
  });

  test("mean2d to match to equal the Welford's mean of the windowSums", () => {
    const A = sampleCsv.lena;
    const meanAcross = mean2d(A);
    const sums = windowSums(A, 1);
    let welfordMean = 0;
    for (let i = 0; i < sums.data.length; ++i) {
      welfordMean = welfordMean + (sums.data[i] - welfordMean) / (i + 1);
    }
    expect(roundTo(welfordMean, 5)).toBe(roundTo(meanAcross, 5));
  });

  test("Check means against matlab average with respect to integers", () => {
    const A = sampleCsv.lena;
    const windowSize = 16;
    const windowWidth = A.width - windowSize + 1;
    const windowHeight = A.height - windowSize + 1;
    const bezkrovnyAverages = [];
    const start = new Date().getTime();
    for (let y = 0; y < windowHeight; ++y) {
      for (let x = 0; x < windowWidth; ++x) {
        const values1 = sub(A, x, windowSize, y, windowSize);
        bezkrovnyAverages.push(average(values1.data));
      }
    }
    const finishedSlowAvgs = new Date().getTime();
    const windowMeans = windowSums(A, 16).data.map((v: number) => v / (windowSize * windowSize));
    const finishedFastAvgs = new Date().getTime();
    expect(windowMeans.length).toBe(bezkrovnyAverages.length);
    for (let i = 0; i < windowMeans.length; ++i) {
      expect(Math.floor(windowMeans[i])).toBe(Math.floor(bezkrovnyAverages[i]));
    }

    expect(finishedFastAvgs - finishedSlowAvgs).toBeLessThan(finishedSlowAvgs - start);
  });


  test("should return NaN with Weber's implementation when k1 / k2 are 0", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const { ssim_map: ssimMap, mssim } = ssim(A, B, k0Options);

    expect(mssim).toBeNaN();
    expect(mean2d(ssimMap)).toBeNaN();
  });


});
