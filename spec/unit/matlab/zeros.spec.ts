import { zeros } from "../../../src/matlab/zeros";
import { flatDataToMx } from "../../helpers/util";

describe("zeros", () => {
  test("should create a matrix of the specified size with all zeros", () => {
    expect(flatDataToMx(zeros(4))).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test("should create a matrix with different width and height when multiple params are set", () => {
    expect(flatDataToMx(zeros(1, 4))).toEqual([[0, 0, 0, 0]]);
  });
});
