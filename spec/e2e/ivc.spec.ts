import { resolve } from "path";
import scores from "../samples/IVC_color.json";
import { ssim } from "../../dist";
import { roundTo } from "../helpers/round";
import { getJSONScores } from "../helpers/getJSONScores";

const path = resolve(__dirname, "../samples/IVC_SubQualityDB/color");

type MSSIMValues = { [key: string]: number };

describe("IVC", () => {
  it("should match stored mssims", async () => {
    const expected = await getJSONScores(scores, path, "bmp");
    const results = Object.entries(expected)
      .map(([key, { file, reference }]): [string, number] => {
        const { mssim } = ssim(reference, file);

        return [key, roundTo(mssim, 3)];
      })
      .reduce(
        (acc, [key, result]) => ({
          ...acc,
          [key]: result
        }),
        {} as MSSIMValues
      );

    expect(scores as MSSIMValues).toEqual(results);
  });
});
