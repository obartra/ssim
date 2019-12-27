import { fspecial } from "../../../src/matlab/fspecial";
import { round } from "../../helpers/round";

describe("fspecial", () => {
  test("should create a gaussian low pass filter of different dimensions", () => {
    const fspecial3 = fspecial("gaussian", 3);
    const fspecial11 = fspecial("gaussian", 11);

    expect(fspecial3.height).toBe(3);
    expect(fspecial3.width).toBe(3);
    expect(round(fspecial3.data[0])).toBe(0.095);
    expect(round(fspecial3.data[1 * fspecial3.width + 1])).toBe(0.148);

    expect(fspecial11.height).toBe(11);
    expect(fspecial11.width).toBe(11);
    expect(round(fspecial11.data[0])).toBe(0);
    expect(round(fspecial11.data[0 * fspecial11.width + 1])).toBe(0);
    expect(round(fspecial11.data[5 * fspecial11.width + 5])).toBe(0.071);
  });

  test('should default to "gaussian" with length 3 and sigma of 1.5', () => {
    const fspecialDefault = fspecial();
    const fspecialGaussian = fspecial("gaussian", 3, 1.5);

    expect(fspecialDefault).toEqual(fspecialGaussian);
  });
});
