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
 * This method mimics Matlab's `conv2` method.
 *
 * @method conv2
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Array.<Number>>} b - The second matrix
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Array.<Array.<Number>>} c - Returns the central part of the convolution of the same
 * size as `a`.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function conv2(a, b, shape = 'full') {
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

	if (shape === 'full') {
		return c;
	} else if (shape === 'same') {
		const rowStart = Math.ceil((c.length - ma) / 2);
		const colStart = Math.ceil((c[0].length - na) / 2);

		return sub(c, rowStart, ma, colStart, na);
	}

	return sub(c, mb - 1, ma - mb + 1, nb - 1, na - nb + 1);
}

module.exports = {
	conv2
};
