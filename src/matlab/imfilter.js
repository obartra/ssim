const { mod } = require('./mod');
const { padarray } = require('./padarray');
const { filter2 } = require('./filter2');

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
	const padHeight = Math.floor(frows / 2);
	const padWidth = Math.floor(fcols / 2);

	A = padarray(A, padHeight, padWidth, pad);
	if (mod(frows, 2) === 0) { // remove the last row
		A.data = A.data.slice(0, -A.width);
		A.height--;
	}
	if (mod(fcols, 2) === 0) { // remove the last column
		const data = new Array(A.width * A.height);
		let length = 0;

		for (let x = 0; x < A.data.length; x++) {
			if ((x + 1) % A.width !== 0) {
				data[length++] = A.data[x];
			}
		}
		data.length = length;
		A.data = data;
		A.width--;
	}
	return A;
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
function imfilter(A, f, pad = 'symmetric', resSize = 'valid') {
	const B = padMatrix(A, f.width, f.height, pad);

	return filter2(f, B, resSize === 'same' ? 'valid' : resSize);
}

module.exports = {
	imfilter
};
