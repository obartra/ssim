import { padarray } from "../../../src/matlab/padarray";

describe("padarray", () => {
  test("should be able to add padding greater than the matrix dimensions", () => {
    const A = {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2
    };
    const out = padarray(A, [3, 3]);
    const expected = {
      data: [
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1,
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        4,
        4,
        3,
        3,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1,
        2,
        2,
        1,
        1
      ],
      width: 2 + 3 * 2,
      height: 2 + 3 * 2
    };

    expect(out).toEqual(expected);
  });

  test("should mirror a matrix multiple times if needed", () => {
    const A = {
      data: [1, 2, 3, 4, 5, 6],
      width: 3,
      height: 2
    };
    const out = padarray(A, [0, 5]);
    const expected = {
      data: [
        2,
        3,
        3,
        2,
        1,
        1,
        2,
        3,
        3,
        2,
        1,
        1,
        2,
        5,
        6,
        6,
        5,
        4,
        4,
        5,
        6,
        6,
        5,
        4,
        4,
        5
      ],
      width: 3 + 5 * 2,
      height: 2 + 0 * 2
    };

    expect(out).toEqual(expected);
  });

  test("should mirror fractions of a full matrix", () => {
    const A = {
      data: [1, 2, 3, 4, 5, 6],
      width: 3,
      height: 2
    };
    const out = padarray(A, [1, 0]);
    const expected = {
      data: [1, 2, 3, 1, 2, 3, 4, 5, 6, 4, 5, 6],
      width: 3,
      height: 2 + 1 * 2
    };

    expect(out).toEqual(expected);
  });

  test("should add 1 value padding", () => {
    const A = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
      width: 4,
      height: 4
    };
    const out = padarray(A, [1, 1]);
    const expected = {
      data: [
        1,
        1,
        2,
        3,
        4,
        4,
        1,
        1,
        2,
        3,
        4,
        4,
        5,
        5,
        6,
        7,
        8,
        8,
        9,
        9,
        0,
        1,
        2,
        2,
        3,
        3,
        4,
        5,
        6,
        6,
        3,
        3,
        4,
        5,
        6,
        6
      ],
      width: 4 + 1 * 2,
      height: 4 + 1 * 2
    };

    expect(out).toEqual(expected);
  });
});
