/**
 * Implements downsampling logic
 *
 * @namespace downsample
 */
import { divide2d, sum2d } from './math'
import { imfilter, ones, skip2d } from './matlab'
import { Matrix, Options } from './types'

/**
 * For a given 2D filter `filter`, downsize image `pixels` by a factor of `f`.
 *
 * @method imageDownsample
 * @param {Matrix} pixels - The matrix to downsample
 * @param {Matrix} filter - The filter to convolve the image with
 * @param {number} f - The downsampling factor (`image size / f`)
 * @returns {Matrix} imdown - The downsampled, filtered image
 * @private
 * @memberOf downsample
 */
function imageDownsample(pixels: Matrix, filter: Matrix, f: number): Matrix {
  const imdown = imfilter(pixels, filter, 'symmetric', 'same')

  return skip2d(imdown, [0, f, imdown.height], [0, f, imdown.width])
}

/**
 * Downsamples images greater than `maxSize` pixels on the smallest direction. If neither image
 * exceeds these dimensions they are returned as they are.
 *
 * It replicates the same logic than the original matlab scripts
 *
 * @method originalDownsample
 * @param {Matrix} pixels1 - The first matrix to downsample
 * @param {Matrix} pixels2 - The second matrix to downsample
 * @param {number} [maxSize=256] - The maximum size on the smallest dimension
 * @returns {[Matrix, Matrix]} ssim_map - A matrix containing the map of computed SSIMs
 * @private
 * @memberOf downsample
 */
function originalDownsample(
  pixels1: Matrix,
  pixels2: Matrix,
  maxSize = 256
): [Matrix, Matrix] {
  const factor = Math.min(pixels1.width, pixels2.height) / maxSize
  const f = Math.round(factor)

  if (f > 1) {
    let lpf = ones(f)

    lpf = divide2d(lpf, sum2d(lpf))

    pixels1 = imageDownsample(pixels1, lpf, f)
    pixels2 = imageDownsample(pixels2, lpf, f)
  }

  return [pixels1, pixels2]
}

/**
 * Determines the downsizing algorithm to implement (if any) to the reference and target images
 *
 * @method downsample
 * @param {[Matrix, Matrix]} pixels - The first and second matrices to downsample
 * @param {Object} options - The inputs options object
 * @returns {[Matrix, Matrix]} pixels - An array containing the 2 downsized images
 * @public
 * @memberOf downsample
 */
export function downsample(
  pixels: [Matrix, Matrix],
  options: Options
): [Matrix, Matrix] {
  if (options.downsample === 'original') {
    return originalDownsample(pixels[0], pixels[1], options.maxSize)
  }
  // else if options.downsample === 'fast' -> the image is downsampled when read (readpixels.js)
  // else do not downsample
  return pixels
}
