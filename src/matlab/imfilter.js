const { mod } = require('./mod');
const { padarray } = require('./padarray');
const { floor } = require('../math');
const { filter2 } = require('./filter2');

/**
 * `B = imfilter(A,f)` filters a 2-dimensional array `A` with the 2-dimensional filter `f`. The
 * array `A`. The result `B` has the same size as `A`.
 *
 * `imfilter` computes each element of the output, `B`. If `A` is an integer, `imfilter` will not
 * truncates the output elements that exceed the range, and it will not rounds fractional values.
 *
 * This method mimics Matlab's `imfilter` method with `padval = 'symmetric'` without integer
 * rounding. No other options have been implemented and, if set, they will be ignored.
 *
 * @method imfilter
 * @param {Array.<Array.<Number>>} A - The target matrix
 * @param {Array.<Array.<Number>>} f - The filter to apply
 * @param {String} [pad="symmetric"] - The type of padding. Only "symmetric" is implemented
 * @param {String} [resSize="same"] - The format to use for the filter size. Valid values are:
 * "same", "valid" and "full"
 * @returns {Array.<Array.<Number>>} B - The filtered array
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function imfilter(A, f, pad = 'symmetric', resSize = 'same') {
	const fcols = f.length;
	const frows = f[0].length;

	A = padarray(A, floor([frows / 2, fcols / 2]), pad);

	if (mod(frows, 2) === 0) {
		A.pop();
	}

	if (mod(fcols, 2) === 0) {
		for (let x = 0; x < A.length; x++) {
			A[x].pop();
		}
	}

	if (resSize === 'same') {
		resSize = 'valid';
	}
	return filter2(f, A, resSize);
}

module.exports = {
	imfilter
};
