/**
 * Implements all ssim-specific logic.
 *
 * Reproduces the original SSIM matlab scripts. For a direct comparison you may want to check the
 * scripts contained within `/assets`
 *
 * @namespace ssim
 */
import {
  add2d,
  divide2d,
  multiply2d,
  square2d,
  subtract2d,
  sum2d,
} from './math'
import { conv2, normpdf, transpose } from './matlab'
import { Options, Matrix } from './types'

/**
 * Generates a SSIM map based on two input image matrices. For images greater than 512 pixels, it
 * will downsample by default (unless `options.downsample` is set to falsy).
 *
 * Images must be a 2-Dimensional grayscale image
 *
 * This method produces the same exact output than `assets/ssim.m` when running on Matlab. It's
 * mathematically equivalent but it is not a line-by-line port. If you want a line-by-line port
 * check `originalSsim`. Several performance optimizations have been made here to achieve greater
 * performance.
 *
 * @method ssim
 * @param {Matrix} pixels1 - The reference matrix
 * @param {Matrix} pixels2 - The second matrix to compare against
 * @param {Options} options - The input options parameter
 * @returns {Matrix} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 */
export function ssim(
  pixels1: Matrix,
  pixels2: Matrix,
  options: Options
): Matrix {
  let w = normpdf(getRange(options.windowSize), 0, 1.5)
  const L = 2 ** options.bitDepth - 1
  const c1 = (options.k1 * L) ** 2
  const c2 = (options.k2 * L) ** 2

  w = divide2d(w, sum2d(w))
  const wt = transpose(w)
  const μ1 = conv2(pixels1, w, wt, 'valid')
  const μ2 = conv2(pixels2, w, wt, 'valid')
  const μ1Sq = square2d(μ1)
  const μ2Sq = square2d(μ2)
  const μ12 = multiply2d(μ1, μ2)
  const pixels1Sq = square2d(pixels1)
  const pixels2Sq = square2d(pixels2)
  const σ1Sq = subtract2d(conv2(pixels1Sq, w, wt, 'valid'), μ1Sq)
  const σ2Sq = subtract2d(conv2(pixels2Sq, w, wt, 'valid'), μ2Sq)
  const σ12 = subtract2d(
    conv2(multiply2d(pixels1, pixels2), w, wt, 'valid'),
    μ12
  )

  if (c1 > 0 && c2 > 0) {
    return genSSIM(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq, c1, c2)
  }
  return genUQI(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq)
}

/**
 * Generates a range of distances of size `2n+1` with increments of 1 and centered at 0.
 *
 * @example `getRange(2) => [2 1 0 1 2]
 * @method getRange
 * @param {Number} size - The maximum distance from the center
 * @returns {Matrix} out - The generated vector
 * @private
 * @memberOf ssim
 */
function getRange(size: number): Matrix {
  const offset = Math.floor(size / 2)
  const data = new Array(offset * 2 + 1)

  for (let x = -offset; x <= offset; x++) {
    data[x + offset] = Math.abs(x)
  }

  return {
    data,
    width: data.length,
    height: 1,
  }
}

/**
 * Generates the ssim_map based on the intermediate values of the convolutions of the input with the
 * gaussian filter.
 *
 * These methods apply when K1 or K2 are not 0 (non UQI)
 *
 * @method genSSIM
 * @param {Matrix} μ12 - The cell-by cell multiplication of both images convolved
 * with the gaussian filter
 * @param {Matrix} σ12 - The convolution of cell-by cell multiplication of both
 * images minus μ12
 * @param {Matrix} μ1Sq - The convolution of image1 with the gaussian filter squared
 * @param {Matrix} μ2Sq - The convolution of image2 with the gaussian filter squared
 * @param {Matrix} σ1Sq - The convolution of image1^2, minus μ1Sq
 * @param {Matrix} σ2Sq - The convolution of image2^2, minus μ2Sq
 * @param {Number} c1 - The first stability constant
 * @param {Number} c2 - The second stability constant
 * @returns {Matrix} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genSSIM(
  μ12: Matrix,
  σ12: Matrix,
  μ1Sq: Matrix,
  μ2Sq: Matrix,
  σ1Sq: Matrix,
  σ2Sq: Matrix,
  c1: number,
  c2: number
): Matrix {
  const num1 = add2d(multiply2d(μ12, 2), c1)
  const num2 = add2d(multiply2d(σ12, 2), c2)
  const denom1 = add2d(add2d(μ1Sq, μ2Sq), c1)
  const denom2 = add2d(add2d(σ1Sq, σ2Sq), c2)

  return divide2d(multiply2d(num1, num2), multiply2d(denom1, denom2))
}

/**
 * Generates the Universal Quality Index (UQI) ssim_map based on the intermediate values of the
 * convolutions of the input with the gaussian filter.
 *
 * These methods apply when K1 or K2 are 0 (UQI)
 *
 * @method genUQI
 * @param {Matrix} μ12 - The cell-by cell multiplication of both images convolved
 * with the gaussian filter
 * @param {Matrix} σ12 - The convolution of cell-by cell multiplication of both
 * images minus μ12
 * @param {Matrix} μ1Sq - The convolution of image1 with the gaussian filter squared
 * @param {Matrix} μ2Sq - The convolution of image2 with the gaussian filter squared
 * @param {Matrix} σ1Sq - The convolution of image1^2, minus μ1Sq
 * @param {Matrix} σ2Sq - The convolution of image2^2, minus μ2Sq
 * @returns {Matrix} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genUQI(
  μ12: Matrix,
  σ12: Matrix,
  μ1Sq: Matrix,
  μ2Sq: Matrix,
  σ1Sq: Matrix,
  σ2Sq: Matrix
): Matrix {
  const numerator1 = multiply2d(μ12, 2)
  const numerator2 = multiply2d(σ12, 2)
  const denominator1 = add2d(μ1Sq, μ2Sq)
  const denominator2 = add2d(σ1Sq, σ2Sq)

  return divide2d(
    multiply2d(numerator1, numerator2),
    multiply2d(denominator1, denominator2)
  )
}
