import { Matrix } from '../types'
import { sum2d, divide2d } from '../math'

/**
 * Creates a matrix of lenght `2 * length + 1` with values being the sum of the square of the
 * distance for each component from the center. E.g:
 *
 * For a length of 5 it results in a matrix size of 11. Looking at [0, 0] (distance: [-5, -5] from
 * the center), the value at that position becomes `-5^2 + -5^2 = 50`
 *
 * @method rangeSquare2d
 * @param {Number} length - The maxium distance from the matrix center
 * @returns {Matrix} mx - The generated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function rangeSquare2d(length: number): Matrix {
  const size = length * 2 + 1
  const data = new Array(size ** 2)

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      data[x * size + y] = (x - length) ** 2 + (y - length) ** 2
    }
  }

  return {
    data,
    width: size,
    height: size,
  }
}

/**
 * Applies a gaussian filter of sigma to a given matrix
 *
 * @method gaussianFilter2d
 * @param {Matrix} A - The input matrix
 * @param {Number} σ - The sigma value
 * @returns {Matrix} B - The matrix with the gaussian filter applied
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function gaussianFilter2d(
  { data: ref, width, height }: Matrix,
  σ: number
): Matrix {
  const data = new Array(ref.length)

  for (let x = 0; x < ref.length; x++) {
    data[x] = Math.exp(-ref[x] / (2 * σ ** 2))
  }

  return {
    data,
    width,
    height,
  }
}
/**
 * Create predefined 2-D filter
 *
 * `h = fspecial(type, parameters)` accepts the filter specified by type plus additional modifying
 * parameters particular to the type of filter chosen. If you omit these arguments, fspecial uses
 * default values for the parameters.
 *
 * This method mimics Matlab's `fspecial2` method with `type = 'gaussian'`. `hsize` cannot be a
 * vector (unlike Matlab's implementation), only a Number is accepted.
 *
 * `h = fspecial('gaussian', hsize, sigma)` returns a rotationally symmetric Gaussian lowpass filter
 * of size `hsize` with standard deviation sigma (positive). In this implementation `hsize` will
 * always be a scalar, which will result in `h` being a square matrix.
 *
 * The gaussian logic follows: hg(hsize) = e^(-2*hsize^2 / 2σ^2)
 *
 * @example
 *   fspecial('gaussian', 3, 1.5) === {
 *     data: [
 *       0.094742, 0.118318, 0.094742,
 *       0.118318, 0.147761, 0.118318,
 *       0.094742, 0.118318, 0.094742
 *     ],
 *     width: 3,
 *     height: 3
 *   };
 *
 * @method fspecial
 * @param {String} [type='gaussian'] - The type of 2D filter to create (coerced to 'gaussian')
 * @param {Number} [hsize=3] - The length of the filter
 * @param {Number} [σ=1.5] - The filter sigma value
 * @returns {Matrix} c - Returns the central part of the convolution of the same
 * size as `a`.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function fspecial(_type?: 'gaussian', hsize = 3, σ = 1.5): Matrix {
  hsize = (hsize - 1) / 2

  const pos = rangeSquare2d(hsize)
  const gauss = gaussianFilter2d(pos, σ)
  const total = sum2d(gauss)

  return divide2d(gauss, total)
}
