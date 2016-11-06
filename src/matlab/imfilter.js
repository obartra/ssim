const { mod } = require('./mod');
const { padarray } = require('./padarray');
const { floor } = require('../math');
const { filter2 } = require('./filter2');
const { conv2 } = require('./conv2');

/**
 * Non-standard version of `imfilter` to handle a 2 1-D kernels, dervied from the single value
 * decomposition of `f` in `imfilter`.
 *
 * `B = dimfilter(A,f,ft)` filters a 2-dimensional array `A` with the 2 1-dimensional filters `f`
 * and ft. The result `B` has the same size as `A`.
 *
 * `dimfilter` computes each element of the output, `B`. If `A` is an integer, `imfilter` will not
 * truncate the output elements that exceed the range, and it will not round fractional values.
 *
 * Similar to this project's implementation of `imfilter`, the only `padval` implemented is
 * "symmetric" and without integer rounding. No other options have been implemented and, if set,
 * they will be ignored.
 *
 * @method dimfilter
 * @param {Object} A - The target matrix
 * @param {Object} f - The 1D filter to apply
 * @param {Object} ft - The second 1D filter to apply
 * @param {String} [pad="symmetric"] - The type of padding. Only "symmetric" is implemented
 * @param {String} [resSize="same"] - The format to use for the filter size. Valid values are:
 * "same", "valid" and "full"
 * @returns {Object} B - The filtered array
 * @public
 * @memberOf matlab
 */
function dimfilter(A, f, ft, pad = 'symmetric', resSize = 'same') {
	const fcols = Math.max(f.height, f.width);
	const frows = Math.max(ft.height, ft.width);

	A = padMatrix(A, frows, fcols, pad);
	resSize = getConv2Size(resSize);

	return conv2(A, f, ft, resSize);
}

/**
 * Adds padding to input matrix A
 *
 * @method padMatrix
 * @param {Object} A - The target matrix
 * @param {Number} frows - The number of rows in the filter
 * @param {Number} fcols - The number of columns in the filter
 * @param {String} pad - The type of padding to apply
 * @param {Object} B - The padded input matrix
 * @private
 * @memberOf matlab
 */
function padMatrix(A, frows, fcols, pad) {
	A = padarray(A, floor([frows / 2, fcols / 2]), pad);
	if (mod(frows, 2) === 0) { // remove the last row
		A.data = A.data.slice(0, -A.width);
		A.height--;
	}
	if (mod(fcols, 2) === 0) { // remove the last column
		const data = [];

		for (let x = 0; x < A.data.length; x++) {
			if ((x + 1) % A.width !== 0) {
				data.push(A.data[x]);
			}
		}
		A.data = data;
		A.width--;
	}
	return A;
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
function getConv2Size(resSize) {
	if (resSize === 'same') {
		resSize = 'valid';
	}
	return resSize;
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
 * @param {Object} A - The target matrix
 * @param {Object} f - The filter to apply
 * @param {String} [pad="symmetric"] - The type of padding. Only "symmetric" is implemented
 * @param {String} [resSize="same"] - The format to use for the filter size. Valid values are:
 * "same", "valid" and "full"
 * @returns {Object} B - The filtered array
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function imfilter(A, f, pad = 'symmetric', resSize = 'same') {
	A = padMatrix(A, f.width, f.height, pad);
	resSize = getConv2Size(resSize);
	return filter2(f, A, resSize);
}

module.exports = {
	imfilter,
	dimfilter
};
