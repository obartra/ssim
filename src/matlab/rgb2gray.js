/**
 * For an array of pixels of the form [r, g, b] it returns the equivalent grayscale color. These
 * values are not derived from ITU's recommendation of [0.2126, 0.7152, 0.0722] for [r, g, b] but on
 * Matlab's implementation of [0.2989, 0.5870, 0.1140]
 *
 * Note that values are rounded to ensure an exact match with the original results. I think
 * rounding them would NOT lead to higher accuracy since the exact values for RGB to grayscale
 * conversion are somewhat arbitrary (as examplified by the differences between ITU and Matlab).
 * ± 0.5 pixel differences won't be perceptible for the human eye and will have a small impact on
 * SSIM. Based on some sample data changes were of the order of 10^-3.
 *
 * @method luma
 * @param {Number[]} subpixels - The different pixels to use in the following order: r, g, b
 * @returns {Number} lumaValue - The value of the luminance for the [r,g,b] pixel
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function luma([r, g, b]) {
	return Math.round(0.29894 * r + 0.58704 * g + 0.11402 * b);
}

/**
 * Converts a 3d matrix of [row, column, rgb] into a 2d one [row, column] where the value is the
 * grayscale equivalent of the rgb input.
 *
 * This method mimics Matlab's `rgb2gray` method
 *
 * @method rgb2gray
 * @param {Array.<Array.<Array.<Number>>>} mx - The input matrix
 * @returns {Array.<Array.<Number>>} grayscale - A 2d grayscale representation of the input image
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function rgb2gray(mx) {
	const lumaMx = [];

	for (let x = 0; x < mx.length; x++) {
		lumaMx[x] = [];
		for (let y = 0; y < mx[x].length; y++) {
			lumaMx[x][y] = luma(mx[x][y]);
		}
	}
	return lumaMx;
}

module.exports = {
	rgb2gray
};
