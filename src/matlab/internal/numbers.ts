import { Matrix } from '../../types'

/**
 * Create a matrix with each cell with the value of `num`
 *
 * @method numbers
 * @param {Number} height - The number of rows
 * @param {Number} width - The number of columns
 * @param {Number} num - The value to set on each cell
 * @returns {Matrix} B - An n-by-m matrix of `num`
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
export function numbers(height: number, width: number, num: number): Matrix {
  const size = width * height
  const data = new Array(size)

  for (let x = 0; x < size; x++) {
    data[x] = num
  }

  return {
    data,
    width,
    height,
  }
}
