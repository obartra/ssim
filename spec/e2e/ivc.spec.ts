import { resolve } from "path";
import scores from "../samples/IVC_color.json";
import weberScores from "../samples/IVC_color-weber.json";
import bezkrovnyScores from "../samples/IVC_color-bezkrovny.json";
import { ssim } from "../../dist";
import { roundTo } from "../helpers/round";
import { getJSONScores } from "../helpers/getJSONScores";

const path = resolve(__dirname, "../samples/IVC_SubQualityDB/color");

type MSSIMValues = { [key: string]: number };

describe("IVC", () => {
  it("should match stored mssims (ssim fast)", async () => {
    const expected = await getJSONScores(scores, path, "bmp");
    const results = Object.entries(expected)
      .map(([key, { file, reference }]): [string, number] => {
        const { mssim } = ssim(reference, file, { ssim: "fast" });

        return [key, roundTo(mssim, 3)];
      })
      .reduce(
        (acc, [key, result]) => ({
          ...acc,
          [key]: result,
        }),
        {} as MSSIMValues
      );

    expect(scores as MSSIMValues).toEqual(results);
  }, 500000);

  it("should match stored mssims (weber)", async () => {
    const expected = await getJSONScores(weberScores, path, "bmp");
    const start = new Date().getTime();
    const results = Object.entries(expected)
      .map(([key, { file, reference }]): [string, number] => {
        const { mssim } = ssim(reference, file, { ssim: "weber" });
        return [key, roundTo(mssim, 3)];
      })
      .reduce(
        (acc, [key, result]) => ({
          ...acc,
          [key]: result,
        }),
        {} as MSSIMValues
      );

    const end = new Date().getTime();
    const referenceScores = scores as MSSIMValues;
    const newV: any = {};
    let newMean = 0;
    let newS = 0;
    for (let score in referenceScores) {
      const refVal = referenceScores[score];
      const weberNewVal = results[score];
      const distWeberNew = Math.abs(refVal - weberNewVal);
      newV[score] = {
        mssim: weberNewVal,
        distance: distWeberNew,
        ref: refVal,
      };
      const newMeanR =
        newMean + (distWeberNew - newMean) / Object.keys(newV).length;
      newS = newS + (distWeberNew - newMean) * (distWeberNew - newMeanR);
      newMean = newMeanR;
    }

    const newVar = newS / (Object.keys(newV).length - 1);

    expect(roundTo(newMean, 4)).toMatchInlineSnapshot(`0.0202`);
    expect(roundTo(newVar, 6)).toMatchInlineSnapshot(`0.000211`);
    expect(results).toEqual(weberScores as MSSIMValues);
  }, 70000);

  it("should match stored mssims (bezkrovny)", async () => {
    const expected = await getJSONScores(weberScores, path, "bmp");
    const start = new Date().getTime();
    const results = Object.entries(expected)
      .map(([key, { file, reference }]): [string, number] => {
        const { mssim } = ssim(reference, file, { ssim: "bezkrovny" });
        return [key, roundTo(mssim, 3)];
      })
      .reduce(
        (acc, [key, result]) => ({
          ...acc,
          [key]: result,
        }),
        {} as MSSIMValues
      );
    const end = new Date().getTime();

    const referenceScores = scores as MSSIMValues;
    const newV: any = {};
    let newMean = 0;
    let newS = 0;
    for (let score in referenceScores) {
      const refVal = referenceScores[score];
      const newVal = results[score];
      const distNew = Math.abs(refVal - newVal);
      newV[score] = {
        mssim: newVal,
        distance: distNew,
        ref: refVal,
      };
      const meanR = newMean + (distNew - newMean) / Object.keys(newV).length;
      newS = newS + (distNew - newMean) * (distNew - meanR);
      newMean = meanR;
    }
    const newVar = newS / (Object.keys(newV).length - 1);
    expect(roundTo(newMean, 4)).toMatchInlineSnapshot(`0.0155`);
    expect(roundTo(newVar, 6)).toMatchInlineSnapshot(`0.000153`);
    expect(results).toEqual(bezkrovnyScores as MSSIMValues);
  }, 70000);
});
