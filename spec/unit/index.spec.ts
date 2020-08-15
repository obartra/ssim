import arScores from "../samples/aspectratio.json";
import { getJSONScores } from "../helpers/getJSONScores";
import * as lib from "../../src";
import lenaScores from "../samples/lena.json";
import { join, resolve } from "path";
import { roundTo } from "../helpers/round";
import { readpixels } from "../helpers/readpixels";
import { Options } from "../../src/types";
import { weberSsim } from "../../src/weberSsim";

const promiseSamples = Object.entries({
  "3x3": join(__dirname, "../samples/3x3.jpg"),
  lena: join(__dirname, "../samples/lena/Q.gif"),
  avion: join(__dirname, "../samples/IVC_SubQualityDB/color/avion.bmp"),
  avion_j2000_r1: join(
    __dirname,
    "../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp"
  )
}).map(
  async ([key, skey]): Promise<[string, ImageData]> => [
    key,
    await readpixels(skey)
  ]
);

describe("ssim", () => {
  let samples: { [key: string]: ImageData };

  beforeEach(async () => {
    samples = (await Promise.all(promiseSamples)).reduce(
      (acc, [key, image]: [string, ImageData]) => ({
        ...acc,
        [key]: image
      }),
      {} as { [key: string]: ImageData }
    );
  });

  test("should be a function", () => {
    expect(lib.ssim).toEqual(expect.any(Function));
  });

  test("should expose additional ssim methods", () => {
    expect(lib.ssim).toEqual(expect.any(Function));
  });

  test("Missing image parameters", () => {
    expect(() => (lib as any).ssim()).toThrow();

    expect(() => (lib as any).ssim("path1")).toThrow();
    expect(() => (lib as any).ssim(undefined, "path2")).toThrow();
  });

  test("Invalid options", () => {
    expect(() => {
      (lib as any).ssim(samples.avion, samples.avion_j2000_r1, { apples: 3 });
    }).toThrow();
    expect(() =>
      lib.ssim(samples.avion, samples.avion_j2000_r1, { k1: -4 })
    ).toThrow();
    expect(() =>
      lib.ssim(samples.avion, samples.avion_j2000_r1, { k2: -0.4 })
    ).toThrow();
  });

  test("Different dimensions", () => {
    expect(() => lib.ssim(samples["3x3"], samples.lena)).toThrow();
  });

  test("should produce a SSIM of 1 when compared with itself (3x3)", () => {
    const { mssim } = lib.ssim(samples["3x3"], samples["3x3"], {
      windowSize: 3
    });
    expect(mssim).toBe(1);
  });

  test("should be able to destructure params from function", () => {
    expect(lib.ssim).toEqual(expect.any(Function));
  });

  test("should produce the right SSIM for bmp images as well (avion)", () => {
    let { mssim } = lib.ssim(samples.avion, samples.avion_j2000_r1, {ssim: "fast"});
    expect(roundTo(mssim, 5)).toEqual(0.98078);
    mssim = lib.ssim(samples.avion, samples.avion_j2000_r1).mssim;
    expect(roundTo(mssim, 4)).toEqual(roundTo(0.98078,4));
  });

  test('downsizing should produce comparable results between "fast" and "original"', () => {
    const { mssim: fastMssim } = lib.ssim(
      samples.avion,
      samples.avion_j2000_r1,
      {
        downsample: "fast"
      }
    );
    const { mssim: origMssim } = lib.ssim(
      samples.avion,
      samples.avion_j2000_r1,
      {
        downsample: "original"
      }
    );

    expect(Math.abs(fastMssim - origMssim) < 0.05).toBe(true);
  });

  test("ssim should produce the same output than originalSsim", () => {
    const { mssim: fast } = lib.ssim(samples.avion, samples.avion_j2000_r1, {
      ssim: "fast"
    });
    const { mssim: original } = lib.ssim(
      samples.avion,
      samples.avion_j2000_r1,
      {
        ssim: "original"
      }
    );

    expect(roundTo(fast, 5)).toEqual(roundTo(original, 5));
  });


  test("should fail if an invalid ssim value is specified", () => {
    expect(() => {
      lib.ssim(samples.avion, samples.avion_j2000_r1, ({
        ssim: "invalid"
      } as unknown) as Options);
    }).toThrow();
  });

  type LoadedData = { file: ImageData; mssim: number; reference: ImageData };
  function compare(
    { file, mssim, reference }: LoadedData,
    expect: jest.Expect
  ) {
    const { mssim: computedMssim } = lib.ssim(reference, file);

    expect(roundTo(computedMssim, 5)).toEqual(mssim);
  }

  Object.entries(
    getJSONScores(lenaScores, resolve(__dirname, "../samples/lena"), "gif")
  ).forEach(([key, ssim]: [string, LoadedData]) => {
    test(`should get a mssim of ${ssim.mssim} for ${key}`, () =>
      compare(ssim, expect));
  });

  Object.entries(
    getJSONScores(arScores, resolve(__dirname, "../samples/aspectratio"), "jpg")
  ).forEach(([key, ssim]: [string, LoadedData]) => {
    test(`should get a mssim of ${ssim.mssim} for ${key}`, () =>
      compare(ssim, expect));
  });

  test("should downsample images and produce somewhat similar results", () => {
    const ssimResults = lib.ssim(samples.avion, samples.avion_j2000_r1);
    const fullSsimResults = lib.ssim(samples.avion, samples.avion_j2000_r1, {
      downsample: false
    });

    const difference = Math.abs(ssimResults.mssim - fullSsimResults.mssim);

    expect(difference).toBeLessThan(0.1);
  });
});
