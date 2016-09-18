const { times } = require('./util');

/**
 * For an array of pixels of the form [r, g, b] it returns the equivalent grayscale color. These
 * values are derived from ITU's "Derivation of luminance singal (Page 4)' on:
 * http://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.709-6-201506-I!!PDF-E.pdf
 *
 * This also matches the implementation of `rgb2gray` in Matlab used by the algorithm proposed by
 * Wang et al. 2003 paper on Image Quality Assessment
 *
 * @method luma
 * @param {Number[]} subpixels - The different pixels to use in the following order: r, g, b
 * @returns {Number} lumaValue - The value of the luminance for the [r,g,b] pixel
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function luma([r, g, b]) {
	return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

/**
 * Retrieves a pixel component (r, g or b) from a set given x and y coordinates
 *
 * @method getSubPixel
 * @param {ndarray} pixels - The image dataset
 * @param {Number} offset - The position at which the pixel begins
 * @param {Number} index - The index component (r = 0, g = 1, b =2)
 * @returns {Number} subpixel - The value for the subpixel at the given position
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function getSubPixel(pixels, offset, index) {
	return pixels.data[offset + (pixels.stride[2] * index)];
}

/**
 * Retrieves a pixel from a set given x and y coordinates
 *
 * @method getPixel
 * @param {Number} x - The target x coordinate
 * @param {Number} y - The target y coordinate
 * @param {ndarray} pixels - The image dataset
 * @returns {Number[]} subpixels - The target pixel in an array of the form [r,g,b]
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function getPixel(x, y, pixels) {
	const offset = pixels.offset + (pixels.stride[0] * x) + (pixels.stride[1] * y);

	return times(3).map(index => getSubPixel(pixels, offset, index));
}

/**
 * Retrieves a pixel luma value from a set given x and y coordinates
 *
 * @method getLumaPixel
 * @param {Number} x - The target x coordinate
 * @param {Number} y - The target y coordinate
 * @param {ndarray} pixels - The image dataset
 * @returns {Number} lumaValue - The target pixel luma value
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function getLumaPixel(x, y, pixels) {
	return luma(getPixel(x, y, pixels));
}

/**
 * Retrieves the size of an image from a pixels object
 *
 * @method getDimensions
 * @param {ndarray} pixels - The image dataset
 * @returns {Object} dimensions - An object containing the width, height and number of channels for
 * the target image
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function getDimensions({ shape }) {
	return {
		width: shape[0],
		height: shape[1],
		channels: shape[2]
	};
}

/**
 * Compares 2 images and makes sure their dimensions (width, height) match
 *
 * @method hasSameDimensions
 * @param {ndarray} pixels1 - The first image dataset
 * @param {ndarray} pixels2 - The second image dataset
 * @returns {Boolean} sameDimensions - true if the images have the same width/height, false
 * otherwise
 * @public
 * @memberOf image
 * @since 0.0.1
 */
function hasSameDimensions({ shape: shape1 }, { shape: shape2 }) {
	return shape1[0] === shape2[0] && shape1[1] === shape2[1];
}

/**
 * Generates all image manipulation operations
 *
 * @namespace image
 */
module.exports = {
	luma,
	getPixel,
	getLumaPixel,
	getDimensions,
	hasSameDimensions
};
