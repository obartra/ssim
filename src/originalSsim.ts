/* eslint-disable max-statements */
// Exceeding max-statements to preserve the structure of the original Matlab script
import {
  add2d,
  divide2d,
  multiply2d,
  square2d,
  subtract2d,
  sum2d,
} from './math'
import { filter2, fspecial } from './matlab'
import { Options, Matrix } from './types'

/**
 * Generates a SSIM map based on two input image matrices. For images greater than 512 pixels, it
 * will downsample them.
 *
 * Images must be a 2-Dimensional grayscale image
 *
 * This method is a line-by-line port of `assets/ssim.m`. Some operations are more verbose here
 * since more logic is needed in JS to manipulate matrices than in Matlab
 *
 * Note that setting `options1.k1` and `options.k2` to 0 will generate the UQI (Universal Quality
 * Index), since it's a special case of SSIM. In general that's undesierable since `k1` and `k2`
 * contribute to the stabilization coeficients `c1` and `c2`.
 *
 * For a mathematically equivalent and more efficient implementation check `./ssim.js`.
 *
 * @method originalSsim
 * @param {Matrix} pixels1 - The reference matrix
 * @param {Matrix} pixels2 - The second matrix to compare against
 * @param {Object} options - The input options parameter
 * @returns {Matrix} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 * @since 0.0.2
 */
export function originalSsim(
  pixels1: Matrix,
  pixels2: Matrix,
  options: Options
): Matrix {
  let w = fspecial('gaussian', options.windowSize, 1.5)
  const L = 2 ** options.bitDepth - 1
  const c1 = (options.k1 * L) ** 2
  const c2 = (options.k2 * L) ** 2

  w = divide2d(w, sum2d(w))

  const μ1 = filter2(w, pixels1, 'valid')
  const μ2 = filter2(w, pixels2, 'valid')
  const μ1Sq = square2d(μ1)
  const μ2Sq = square2d(μ2)
  const μ12 = multiply2d(μ1, μ2)
  const pixels1Sq = square2d(pixels1)
  const pixels2Sq = square2d(pixels2)
  const σ1Sq = subtract2d(filter2(w, pixels1Sq, 'valid'), μ1Sq)
  const σ2Sq = subtract2d(filter2(w, pixels2Sq, 'valid'), μ2Sq)
  const σ12 = subtract2d(filter2(w, multiply2d(pixels1, pixels2), 'valid'), μ12)

  if (c1 > 0 && c2 > 0) {
    const num1 = add2d(multiply2d(μ12, 2), c1)
    const num2 = add2d(multiply2d(σ12, 2), c2)
    const denom1 = add2d(add2d(μ1Sq, μ2Sq), c1)
    const denom2 = add2d(add2d(σ1Sq, σ2Sq), c2)

    return divide2d(multiply2d(num1, num2), multiply2d(denom1, denom2))
  }

  const numerator1 = multiply2d(μ12, 2)
  const numerator2 = multiply2d(σ12, 2)
  const denominator1 = add2d(μ1Sq, μ2Sq)
  const denominator2 = add2d(σ1Sq, σ2Sq)

  return divide2d(
    multiply2d(numerator1, numerator2),
    multiply2d(denominator1, denominator2)
  )
}
