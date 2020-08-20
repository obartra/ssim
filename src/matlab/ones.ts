import { Matrix } from '../types'
import { numbers } from './internal/numbers'

/**
 * Create a matrix of all ones
 *
 * This method mimics Matlab's `ones` method
 *
 * @method ones
 * @param {Number} height - The height of the matrix (rows)
 * @param {Number} [width=height] - The width of the matrix (columns)
 * @returns {Matrix} B - An n-by-m matrix of ones
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function ones(height: number, width: number = height): Matrix {
  return numbers(height, width, 1)
}
