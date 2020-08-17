import { Options } from "../../src/types";
import { average, covariance, mean2d, variance } from "../../src/math";
import { defaults } from "../../src/defaults";
import { ssim } from "../../src/index";
import { roundTo } from "../helpers/round";
import { sampleCsv, samples } from "../helpers/matrices";
import {
  partialSumMatrix1,
  partialSumMatrix1Forward,
  windowCovariance, windowCovarianceForward, windowMatrix, windowMatrixForward,
  windowSums,
  windowVariance, windowVarianceForward
} from "../../src/weberSsim";
import { sub } from "../../src/matlab";


const testDataImg = {
  width: 4, height: 4, data: [
    0x10, 0x20, 0x30, 0x40,
    0x50, 0x60, 0x70, 0x80,
    0x90, 0xa0, 0xb0, 0xc0,
    0xd0, 0xe0, 0xf0, 0xff
  ]
};
const testDataImg2 = {
  width: 4, height: 4, data: [
    0x0c, 0x1c, 0x2c, 0x3c,
    0x4c, 0x5c, 0x6c, 0x7c,
    0x8c, 0x9c, 0xac, 0xbc,
    0xcc, 0xdc, 0xec, 0xfc
  ]
};

const testPSForwardImg1 = {
  width: 5, height: 5, data: new Int32Array([
    0, 0, 0, 0, 0,
    0, 16, 48, 96, 160,
    0, 96, 224, 384, 576,
    0, 240, 528, 864, 1248,
    0, 448, 960, 1536, 2175])
};


describe("weberSsim", () => {
  let options: Options;
  let k0Options: Options;
  let optionsForward: Options;
  let k0OptionsForward: Options;

  beforeEach(() => {
    options = { ...defaults, ssim: "weber" };
    k0Options = { ...defaults, ssim: "weber", k1: 0, k2: 0 };
    optionsForward = { ...defaults, ssim: "weberForward" };
    k0OptionsForward = { ...defaults, ssim: "weberForward", k1: 0, k2: 0  };
  });

  test("should return same results than Webers's implementation", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const ssimMap = ssim(A, B, options).ssim_map;
    expect(roundTo(mean2d(ssimMap), 5)).toMatchSnapshot();
  });

  test("rolling ssim mssim should be the same as mean2d ssim", () => {
    const A = sampleCsv.lena;
    const B = sampleCsv.lena02876;
    const { ssim_map: ssimMap, mssim } = ssim(A, B, options);
    expect(roundTo(mean2d(ssimMap), 5)).toMatchSnapshot();
    expect(roundTo(mssim, 5)).toMatchSnapshot();
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


  test("matlab averages, variances, covariances should be the same as weber's", () => {
    const A = testDataImg;
    const B = testDataImg2;
    const windowSize = 2;
    const windowWidth = A.width - windowSize + 1;
    const windowHeight = A.height - windowSize + 1;
    const matlabXAverages = [];
    const matlabYAverages = [];
    const matlabXVariances = [];
    const matlabYVariances = [];
    const matlabCovariances = [];
    for (let y = 0; y < windowHeight; ++y) {
      for (let x = 0; x < windowWidth; ++x) {
        const values1 = sub(A, x, windowSize, y, windowSize);
        const values2 = sub(B, x, windowSize, y, windowSize);
        const avgX = average(values1.data);
        const avgY = average(values2.data);
        const varX = variance(values1.data, avgX);
        const varY = variance(values2.data, avgY);
        const covX = covariance(values1.data, values2.data, avgX, avgY);
        matlabXAverages.push(avgX);
        matlabYAverages.push(avgY);
        matlabXVariances.push(varX);
        matlabYVariances.push(varY);
        matlabCovariances.push(covX);
      }
    }
    const sumsX = windowSums(A, windowSize);
    const meansX = Array.from(sumsX.data, (v: number) => v / (windowSize * windowSize));
    const variancesX = windowVariance(A, sumsX, windowSize);
    const sumsY = windowSums(B, windowSize);
    const meansY = Array.from(sumsY.data, (v: number) => v / (windowSize * windowSize));
    const variancesY = windowVariance(B, sumsY, windowSize);
    const covariances = windowCovariance(A, B, sumsX, sumsY, windowSize);
    expect(meansX.length).toBe(matlabXAverages.length);
    expect(meansX.length).toBe(matlabYAverages.length);
    expect(meansX.length).toBe(matlabXVariances.length);
    expect(meansX.length).toBe(matlabYVariances.length);
    expect(meansX.length).toBe(matlabCovariances.length);
    for (let i = 0; i < meansX.length; ++i) {
      expect(meansX[i]).toBe(matlabXAverages[i]);
      expect(meansY[i]).toBe(matlabYAverages[i]);
      expect(variancesX.data[i] / 1024).toBe(matlabXVariances[i]);
      expect(variancesY.data[i] / 1024).toBe(matlabYVariances[i]);
      expect(covariances.data[i] / 1024).toBe(matlabCovariances[i]);
    }
  });

  test("patrialSumMatrixForward should equal the google sheets matrix", () => {
    const sums = partialSumMatrix1Forward(testDataImg, (v => v));
    expect(sums).toEqual(testPSForwardImg1);
  });

  test("make sure windowMatrixBackward and windowMatrixForward produce the same output", () => {
    const sumMatrixBackward1 = partialSumMatrix1(testDataImg, (v => v));
    const sumMatrixForward1 = partialSumMatrix1Forward(testDataImg, (v => v));
    const windowMatrixBackward1 = windowMatrix(sumMatrixBackward1, 2, 1);
    const windowMatrixForward1 = windowMatrixForward(sumMatrixForward1, 2, 1);
    expect(windowMatrixForward1).toEqual(windowMatrixBackward1);

    const sumMatrixBackward2 = partialSumMatrix1(testDataImg2, (v => v));
    const sumMatrixForward2 = partialSumMatrix1Forward(testDataImg2, (v => v));
    const windowMatrixBackward2 = windowMatrix(sumMatrixBackward2, 2, 1);
    const windowMatrixForward2 = windowMatrixForward(sumMatrixForward2, 2, 1);
    expect(windowMatrixForward2).toEqual(windowMatrixBackward2);
  });

  test("make sure windowVarianceForward and windowCovarianceForward match their backward equivalents", () => {
    const windowSize = 2;
    const sumMatrixBackward1 = partialSumMatrix1(testDataImg, (v => v));
    const sumMatrixForward1 = partialSumMatrix1Forward(testDataImg, (v => v));
    const windowMatrixBackward1 = windowMatrix(sumMatrixBackward1, windowSize, 1);
    const windowMatrixForward1 = windowMatrixForward(sumMatrixForward1, windowSize, 1);
    const sumMatrixBackward2 = partialSumMatrix1(testDataImg2, (v => v));
    const sumMatrixForward2 = partialSumMatrix1Forward(testDataImg2, (v => v));
    const windowMatrixBackward2 = windowMatrix(sumMatrixBackward2, windowSize, 1);
    const windowMatrixForward2 = windowMatrixForward(sumMatrixForward2, windowSize, 1);
    const varXForward = windowVarianceForward(testDataImg, windowMatrixForward1, windowSize);
    const varXBackward = windowVariance(testDataImg, windowMatrixBackward1, windowSize);
    const varYForward = windowVarianceForward(testDataImg2, windowMatrixForward2, windowSize);
    const varYBackward = windowVariance(testDataImg2, windowMatrixBackward2, windowSize);
    const covForward = windowCovarianceForward(testDataImg, testDataImg2, windowMatrixForward1, windowMatrixForward2, windowSize);
    const covBackward = windowCovariance(testDataImg, testDataImg2, windowMatrixBackward1, windowMatrixBackward2, windowSize);
    expect(varXForward).toEqual(varXBackward);
    expect(varYForward).toEqual(varYBackward);
    expect(covForward).toEqual(covBackward);
  });

  test("should return NaN with Weber's implementation when k1 / k2 are 0", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const { ssim_map: ssimMap, mssim } = ssim(A, B, k0Options);
    const { ssim_map: ssimMapForward, mssim: mssimForward } = ssim(A, B, k0OptionsForward);
    expect(mssim).toBeNaN();
    expect(mean2d(ssimMap)).toBeNaN();
    expect(mssimForward).toBeNaN();
    expect(mean2d(ssimMapForward)).toBeNaN();
  });


});
