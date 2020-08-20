import { Matrix } from '../types'

/**
 * Crops the matrix and returns a window at position `[x,y]` of size `[xlen, ylen]` from the input
 * matrix
 *
 * @method sub
 * @param {Matrix} A - The input matrix
 * @param {Number} x - The starting x offset
 * @param {Number} height - The vertical size of the window
 * @param {Number} y - The starting y offset
 * @param {Number} width - The horizontal size of the window
 * @returns {Matrix} B - The generated subwindow from matrix `c`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function sub(
  { data: ref, width: refWidth }: Matrix,
  x: number,
  height: number,
  y: number,
  width: number
): Matrix {
  const data = new Array(width * height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      data[i * width + j] = ref[(y + i) * refWidth + x + j]
    }
  }

  return {
    data,
    width,
    height,
  }
}
