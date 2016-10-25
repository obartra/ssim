const { sub } = require('./sub');
const { zeros } = require('./zeros');

/**
 * `C = conv2(a,b)` computes the two-dimensional convolution of matrices `a` and `b`. If one of
 * these matrices describes a two-dimensional finite impulse response (FIR) filter, the other matrix
 * is filtered in two dimensions. The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb,nb] = size(b), and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a subsection of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * @method mxConv2
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Array.<Number>>} b - The second matrix
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Array.<Array.<Number>>} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function mxConv2(a, b, shape = 'full') {
	const ma = a.length;
	const na = a[0].length;
	const mb = b.length;
	const nb = b[0].length;
	const c = zeros(ma + mb - 1, na + nb - 1);

	/**
	 * Computing the convolution is the most computentionally intensive task for SSIM and we do it
	 * several times.
	 *
	 * This section has been optimized for performance and readability suffers.
	 */
	for (let r1 = 0; r1 < mb; r1++) {
		for (let c1 = 0; c1 < nb; c1++) {
			const br1c1 = b[r1][c1];

			for (let i = 0; i < ma; i++) {
				for (let j = 0; j < na; j++) {
					c[i + r1][j + c1] += a[i][j] * br1c1;
				}
			}
		}
	}

	return reshape(c, shape, ma, mb, na, nb);
}

/**
 * `C = convn(a,b1, b2)` computes the two-dimensional convolution of matrices `a.*b1.*b2`.
 *
 * The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb] = size(b1), [nb] = size(b2) and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a subsection of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * This method mimics Matlab's `convn` method but limited to 2 1 dimensional kernels.
 *
 * @method convn
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Number>} b1 - The first 1-D kernel
 * @param {Array.<Number>} b2 - The second 1-D kernel
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Array.<Array.<Number>>} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function convn(a, b1, b2, shape = 'full') {
	const ma = a.length;
	const na = a[0].length;
	const mb = Math.max(b1.length, b1[0].length || 0);
	const nb = Math.max(b2.length, b2[0].length || 0);

	if (typeof b1[0] === 'number') {
		b1 = [b1];
	}

	if (typeof b2[0] === 'number') {
		b2 = [b2];
	}

	const temp = mxConv2(a, b1, 'full');
	const c = mxConv2(temp, b2, 'full');

	return reshape(c, shape, ma, mb, na, nb);
}

/**
 * `reshape` crops the resulting convolution matrix to match the values specified in `shape`.
 *
 * - **full**: Returns the input
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges
 *
 * @method reshape
 * @param {Array.<Array.<Number>>} c - The output matrix
 * @param {String} shape - One of 'full' / 'same' / 'valid'
 * @param {Number} ma - The number of rows of the input matrix
 * @param {Number} mb - The number of rows of the input filter
 * @param {Number} na - The number of columns of the input matrix
 * @param {Number} nb - The number of columns of the input filter
 * @returns {Array.<Array.<Number>>} c - Returns the input convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function reshape(c, shape, ma, mb, na, nb) {
	if (shape === 'full') {
		return c;
	} else if (shape === 'same') {
		const rowStart = Math.ceil((c.length - ma) / 2);
		const colStart = Math.ceil((c[0].length - na) / 2);

		return sub(c, rowStart, ma, colStart, na);
	}

	return sub(c, mb - 1, ma - mb + 1, nb - 1, na - nb + 1);
}

/**
 * `C = conv2(a,b)` computes the two-dimensional convolution of matrices `a` and `b`. If one of
 * these matrices describes a two-dimensional finite impulse response (FIR) filter, the other matrix
 * is filtered in two dimensions.
 *
 * The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb,nb] = size(b), and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a subsection of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * Alternatively, 2 1-D filters may be provided as parameters, following the format:
 * `conv2(a, b1, b2, shape)`. This is similar to Matlab's implementation allowing any number of 1-D
 * filters to be applied but limited to 2
 *
 * This method mimics Matlab's `conv2` method.
 *
 * Given:
 * const A = rand(3);
 * const B = rand(4);
 *
 * @example conv2(A,B); // output is 6-by-6
 * [
 *   [0.1838, 0.2374, 0.9727, 1.2644, 0.7890, 0.3750],
 *   [0.6929, 1.2019, 1.5499, 2.1733, 1.3325, 0.3096],
 *   [0.5627, 1.5150, 2.3576, 3.1553, 2.5373, 1.0602],
 *   [0.9986, 2.3811, 3.4302, 3.5128, 2.4489, 0.8462],
 *   [0.3089, 1.1419, 1.8229, 2.1561, 1.6364, 0.6841],
 *   [0.3287, 0.9347, 1.6464, 1.7928, 1.2422, 0.5423]
 * ]
 *
 * @example conv2(A,B,'same') => // output is the same size as A: 3-by-3
 * [
 *   [2.3576, 3.1553, 2.5373],
 *   [3.4302, 3.5128, 2.4489],
 *   [1.8229, 2.1561, 1.6364]
 * ]
 *
 * @method conv2
 * @param {Array} args - The list of arguments, see `mxConv2` and `convn` for the exact parameters
 * @returns {Array.<Array.<Number>>} c - Returns the convolution filtered by `shape`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function conv2(...args) {
	if (args[2] instanceof Array) {
		return convn(...args);
	}
	return mxConv2(...args);
}

module.exports = {
	conv2
};
