import { mod } from './mod'
import { padarray, PaddingValue } from './padarray'
import { floor } from '../math'
import { filter2 } from './filter2'
import { Matrix, Shape } from '../types'

/**
 * Adds padding to input matrix A
 *
 * @method padMatrix
 * @param {Matrix} A - The target matrix
 * @param {Number} frows - The number of rows in the filter
 * @param {Number} fcols - The number of columns in the filter
 * @param {String} pad - The type of padding to apply
 * @param {Matrix} B - The padded input matrix
 * @private
 * @memberOf matlab
 */
function padMatrix(
  A: Matrix,
  frows: number,
  fcols: number,
  pad: PaddingValue
): Matrix {
  A = padarray(A, floor([frows / 2, fcols / 2]) as [number, number], pad)
  if (mod(frows, 2) === 0) {
    // remove the last row
    A.data = A.data.slice(0, -A.width)
    A.height--
  }
  if (mod(fcols, 2) === 0) {
    // remove the last column
    const data = []

    for (let x = 0; x < A.data.length; x++) {
      if ((x + 1) % A.width !== 0) {
        data.push(A.data[x])
      }
    }
    A.data = data
    A.width--
  }
  return A
}

/**
 * Gets the `shape` parameter for `conv2` based on the `resSize` parameter for `imfilter`. In most
 * cases they are equivalent except for when `resSize` equals "same" which is converted to "valid".
 *
 * @method getConv2Size
 * @param {String} resSize - The format to use for the `imfilter` call
 * @returns {String} shape - The shape value to use for `conv2`
 * @private
 * @memberOf matlab
 */
function getConv2Size(resSize: Shape): Shape {
  if (resSize === 'same') {
    resSize = 'valid'
  }
  return resSize
}

/**
 * `B = imfilter(A,f)` filters a 2-dimensional array `A` with the 2-dimensional filter `f`. The
 * result `B` has the same size as `A`.
 *
 * `imfilter` computes each element of the output, `B`. If `A` is an integer, `imfilter` will not
 * truncate the output elements that exceed the range, and it will not round fractional values.
 *
 * This method mimics Matlab's `imfilter` method with `padval = 'symmetric'` without integer
 * rounding. No other options have been implemented and, if set, they will be ignored.
 *
 * @method imfilter
 * @param {Matrix} A - The target matrix
 * @param {Matrix} f - The filter to apply
 * @param {String} [pad="symmetric"] - The type of padding. Only "symmetric" is implemented
 * @param {String} [resSize="same"] - The format to use for the filter size. Valid values are:
 * "same", "valid" and "full"
 * @returns {Matrix} B - The filtered array
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function imfilter(
  A: Matrix,
  f: Matrix,
  pad: PaddingValue = 'symmetric',
  resSize: Shape = 'same'
) {
  A = padMatrix(A, f.width, f.height, pad)
  resSize = getConv2Size(resSize)
  return filter2(f, A, resSize)
}
