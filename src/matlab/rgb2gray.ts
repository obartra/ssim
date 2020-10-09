import { Matrix, ImageData } from '../types'

/**
 * Converts an imageData object of { width, height, data } into a 2d matrix [row, column]
 * where the value is the grayscale equivalent of the rgb input.
 *
 * This method mimics Matlab's `rgb2gray` method
 *
 * @method rgb2gray
 * @param {Matrix | ImageData} imageData - The input imageData
 * @returns {Object} grayscale - A grayscale representation of the input image
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function rgb2gray({
  data: d,
  width,
  height,
}: Matrix | ImageData): Matrix {
  const uint8Array = new Uint8Array(width * height)
  for (let i = 0; i < d.length; i += 4) {
    const grayIndex = i / 4
    /**
     * These values are not derived from ITU's recommendation of: [0.2126,
     * 0.7152, 0.0722] for [r, g, b] but on Matlab's implementation of [0.2989,
     * 0.5870, 0.1140]
     *
     * Note that values are rounded to ensure an exact match with the original
     * results. Rounding them would NOT lead to higher accuracy since the exact
     * values for RGB to grayscale conversion are somewhat arbitrary (as shown
     * by the differences between ITU and Matlab).
     *
     * ± 0.5 pixel differences won't be perceptible for the human eye and will
     * have a small impact on SSIM. Based on some sample data changes were of
     * the order of 10^-3.
     */
    uint8Array[grayIndex] =
      0.29894 * d[i] + 0.58704 * d[i + 1] + 0.11402 * d[i + 2] + 0.5
  }
  return {
    data: Array.from(uint8Array),
    width,
    height,
  }
}

export function rgb2grayInteger({
  data: d,
  width,
  height,
}: Matrix | ImageData): Matrix {
  const array = new Array(width * height)
  for (let i = 0; i < d.length; i += 4) {
    const grayIndex = i / 4
    array[grayIndex] = (77 * d[i] + 150 * d[i + 1] + 29 * d[i + 2] + 128) >> 8
  }
  return {
    data: array,
    width,
    height,
  }
}
