const { sum2d, divide2d } = require('../math');

/**
 * Creates a matrix of lenght `2 * length + 1` with values being the sum of the square of the
 * distance for each component from the center. E.g:
 *
 * For a length of 5 it results in a matrix size of 11. Looking at [0, 0] (distance: [-5, -5] from
 * the center), the value at that position becomes `-5^2 + -5^2 = 50`
 *
 * @method rangeSquare2d
 * @param {Number} length - The maxium distance from the matrix center
 * @returns {Array.<Array.<Number>>} mx - The generated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function rangeSquare2d(length) {
	const mx = [];

	for (let x = 0; x <= length * 2; x++) {
		mx[x] = [];
		for (let y = 0; y <= length * 2; y++) {
			mx[x][y] = Math.pow(x - length, 2) + Math.pow(y - length, 2);
		}
	}

	return mx;
}

/**
 * Applies a gaussian filter of sigma to a given matrix
 *
 * @method gaussianFilter2d
 * @param {Array.<Array.<Number>>} mx - The input matrix
 * @param {Number} σ - The sigma value
 * @returns {Array.<Array.<Number>>} out - The matrix with the gaussian filter applied
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function gaussianFilter2d(mx, σ) {
	const out = [];

	for (let x = 0; x < mx.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx[x].length; y++) {
			out[x][y] = Math.exp(-mx[x][y] / (2 * Math.pow(σ, 2)));
		}
	}

	return out;
}
/**
 * Create predefined 2-D filter
 *
 * `h = fspecial(type, parameters)` accepts the filter specified by type plus additional modifying
 * parameters particular to the type of filter chosen. If you omit these arguments, fspecial uses
 * default values for the parameters.
 *
 * This method mimics Matlab's `fspecial2` method with `type = 'gaussian'`. `hsize` cannot be a
 * vector (unlike Matlab's implementation), only a Number is accepted
 *
 * `h = fspecial('gaussian', hsize, sigma)` returns a rotationally symmetric Gaussian lowpass filter
 * of size `hsize` with standard deviation sigma (positive). `hsize` can be a scalar, in which case
 * `h` is a square matrix.
 *
 * @method fspecial
 * @param {String} [type='gaussian'] - The type of 2D filter to create (coerced to 'gaussian')
 * @param {Number} [hsize=3] - The length of the filter
 * @param {Number} [σ=1.5] - The filter sigma value
 * @returns {Array.<Array.<Number>>} c - Returns the central part of the convolution of the same
 * size as `a`.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function fspecial(type = 'gaussian', hsize = 3, σ = 1.5) {
	hsize = (hsize - 1) / 2;

	const pos = rangeSquare2d(hsize);
	const gauss = gaussianFilter2d(pos, σ);
	const total = sum2d(gauss);

	return divide2d(gauss, total);
}

module.exports = {
	fspecial
};
