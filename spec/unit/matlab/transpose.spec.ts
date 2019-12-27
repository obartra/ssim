import { transpose } from "../../../src/matlab/transpose";
import { ones } from "../../../src/matlab/ones";

describe("transpose", () => {
  test("should transpose a vector", () => {
    expect(transpose(ones(1, 4))).toEqual({
      data: [1, 1, 1, 1],
      width: 1,
      height: 4
    });
  });

  test("should transpose a vertical vector into a matrix", () => {
    expect(transpose(ones(4, 1))).toEqual({
      data: [1, 1, 1, 1],
      width: 4,
      height: 1
    });
  });

  test("should transpose a matrix", () => {
    expect(
      transpose({
        data: [1, 2, 3, 4, 5, 6],
        width: 3,
        height: 2
      })
    ).toEqual({
      data: [1, 4, 2, 5, 3, 6],
      width: 2,
      height: 3
    });
  });
});
