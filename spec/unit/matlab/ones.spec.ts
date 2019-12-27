import { ones } from "../../../src/matlab/ones";
import { flatDataToMx } from "../../helpers/util";

describe("ones", () => {
  test("should create a matrix of the specified size with all ones", () => {
    expect(flatDataToMx(ones(4))).toEqual([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ]);
  });

  test("should create a matrix with different width and height when multiple params are set", () => {
    expect(flatDataToMx(ones(1, 4))).toEqual([[1, 1, 1, 1]]);
  });
});
