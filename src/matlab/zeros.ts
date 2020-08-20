import { Matrix } from '../types'
import { numbers } from './internal/numbers'

/**
 * Create a matrix of all zeros
 *
 * This method mimics Matlab's `zeros` method
 *
 * @method zeros
 * @param {Number} height - The height of the matrix (rows)
 * @param {Number} [width=height] - The width of the matrix (columns)
 * @returns {Matrix} B - An n-by-m matrix of zeros
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function zeros(height: number, width: number = height): Matrix {
  return numbers(height, width, 0)
}
