import { Matrix } from "../../src/types";

type AnyMatrix =
  | Matrix
  | (ImageData & {
      data?: Uint8ClampedArray;
    });

export function flatDataToMx({
  data: d,
  width,
  height
}: AnyMatrix): number[][] {
  const matrix: number[][] = [];

  for (let i = 0; i < height; i++) {
    matrix[i] = [];
    for (let j = 0; j < width; j++) {
      const index = j * height + i;

      matrix[i][j] = d[index];
    }
  }

  return matrix;
}

export function flatMxToData(mx: number[][] = []): Matrix {
  return {
    data: ([] as number[]).concat(...mx),
    width: mx[0].length,
    height: mx.length
  };
}
