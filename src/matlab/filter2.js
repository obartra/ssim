const { conv2 } = require('./conv2');

/**
 * Rotates a matrix 180deg.
 *
 * @example
 * 1 2 3 4  becomes:  8 7 6 5
 * 5 6 7 8            4 3 2 1
 *
 * @method rotate1802d
 * @param {Array.<Array.<Number>>} mx - The input matrix
 * @returns {Array.<Array.<Number>>} out - The rotated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function rotate1802d({ data: ref, width, height }) {
	const data = [];

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			data[i * width + j] = ref[(height - 1 - i) * width + width - 1 - j];
		}
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Given a matrix X and a two-dimensional FIR filter h, filter2 rotates your filter matrix 180
 * degrees to create a convolution kernel. It then calls conv2, the two-dimensional convolution
 * function, to implement the filtering operation.
 *
 * This method mimics Matlab's `filter2` method
 *
 * @method filter2
 * @param {Array.<Array.<Number>>} h - The FIR filter
 * @param {Array.<Array.<Number>>} X - The input matrix
 * @param string [shape='same'] - The convolution shape
 * @returns {Array.<Array.<Number>>} conv - The 2D convolution of X with h
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function filter2(h, X, shape = 'same') {
	return conv2(X, rotate1802d(h), shape);
}

module.exports = {
	filter2
};
