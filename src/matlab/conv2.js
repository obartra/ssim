const { sub } = require('./sub');
const { zeros } = require('./zeros');
const { multiply2d } = require('../math');

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
 * @param {Object} A - The first matrix
 * @param {Object} B - The second matrix
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Object} C - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function mxConv2(A, B, shape = 'full') {
	const width = A.width + B.width - 1;
	const height = A.height + B.height - 1;
	const C = zeros(height, width);

	for (let r1 = 0; r1 < B.height; r1++) {
		for (let c1 = 0; c1 < B.width; c1++) {
			const br1c1 = B.data[r1 * B.width + c1];

			if (br1c1) {
				for (let i = 0; i < A.height; i++) {
					for (let j = 0; j < A.width; j++) {
						C.data[(i + r1) * C.width + j + c1] += A.data[i * A.width + j] * br1c1;
					}
				}
			}
		}
	}

	return reshape(C, shape, A.height, B.height, A.width, B.width);
}

/**
 * `C = boxConv(A, B)` computes the two-dimensional convolution of a matrix `A` and box kernel `B`.
 *
 * The `shape` parameter returns a subsection of the two-dimensional convolution as defined by
 * mxConv2.
 *
 * @method boxConv
 * @param {Object} A - The first matrix
 * @param {Object} B - The box kernel
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Object} C - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function boxConv(A, B, shape = 'full') {
	const temp1 = boxConvV(A, B.height);
	const temp2 = boxConvH(temp1, B.width);
	const out = reshape(temp2, shape, A.height, B.height, A.width, B.width);

	return multiply2d(out, B.data[0]);
}

/**
 * `boxConvH(A,B,C)` computes the two-dimensional convolution of a matrix `A` with the one
 * dimensional, horizontal, box kernel `B`.
 *
 * @method boxConvH
 * @param {Object} A - The first matrix
 * @param {Number} B - The horizontal box kernel width
 * @returns {Object} C - The intermediate decomposed convolution
 * @private
 * @memberOf matlab
 */
function boxConvH(A, width) {
	const cWidth = (A.width + width - 1);
	const C = {
		width: cWidth,
		height: A.height,
		data: new Array(cWidth * A.height)
	};

	for (let i = 0; i < C.height; i++) {
		C.data[i * C.width] = A.data[i * A.width] || 0;

		for (let j = 1; j < width; j++) {
			const previous = C.data[i * C.width + j - 1] || 0;
			const current = j >= A.width ? 0 : A.data[i * A.width + j] || 0;

			C.data[i * C.width + j] = previous + current;
		}

		for (let j = width; j < C.width; j++) {
			const old = A.data[i * A.width + j - width] || 0;
			const previous = C.data[i * C.width + j - 1] || 0;
			const current = j >= A.width ? 0 : A.data[i * A.width + j] || 0;

			C.data[i * C.width + j] = previous + current - old;
		}
	}

	return C;
}

/**
 * `boxConvV(A,B,C)` computes the two-dimensional convolution of a matrix `A` with the one
 * dimensional, vertical, box kernel `B`.
 *
 * @method boxConvH
 * @param {Object} A - The first matrix
 * @param {Number} B - The vertical box kernel height
 * @returns {Object} C - The intermediate decomposed convolution
 * @private
 * @memberOf matlab
 */
function boxConvV(A, height) {
	const cHeight = (A.height + height - 1);
	const C = {
		width: A.width,
		height: cHeight,
		data: new Array(A.width * cHeight)
	};

	for (let j = 0; j < C.width; j++) {
		C.data[j] = A.data[j] || 0;

		for (let i = 1; i < height; i++) {
			const previous = C.data[(i - 1) * C.width + j] || 0;
			const current = A.data[i * A.width + j] || 0;

			C.data[i * C.width + j] = previous + current;
		}

		for (let i = height; i < C.height; i++) {
			const old = A.data[(i - height) * A.width + j] || 0;
			const previous = C.data[(i - 1) * C.width + j] || 0;
			const current = A.data[i * A.width + j] || 0;

			C.data[i * C.width + j] = previous + current - old;
		}
	}

	return C;
}

/**
 * Determines whether all values in an array are the same so that the kernel can be treated as a box
 * kernel
 *
 * @method isBoxKernel
 * @param {Object} a - The input matrix
 * @returns {Boolean} boxKernel - Returns true if all values in the matrix are the same, false
 * otherwise
 * @private
 * @memberOf matlab
 */
function isBoxKernel(A) {
	const expected = A.data[0];

	for (let i = 1; i < A.data.length; i++) {
		if (A.data[i] !== expected) {
			return false;
		}
	}
	return true;
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
 * `shape` returns a section of the two-dimensional convolution, based on one of these values for
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
 * @param {Object} A - The first matrix
 * @param {Object} B1 - The first 1-D kernel
 * @param {Object} B2 - The second 1-D kernel
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Object} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function convn(A, B1, B2, shape = 'full') {
	const mb = Math.max(B1.height, B1.width);
	const nb = Math.max(B2.height, B2.width);
	const temp = mxConv2(A, B1, 'full');
	const c = mxConv2(temp, B2, 'full');

	return reshape(c, shape, A.height, mb, A.width, nb);
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
 * @param {Object} c - The output matrix
 * @param {String} shape - One of 'full' / 'same' / 'valid'
 * @param {Number} ma - The number of rows of the input matrix
 * @param {Number} mb - The number of rows of the input filter
 * @param {Number} na - The number of columns of the input matrix
 * @param {Number} nb - The number of columns of the input filter
 * @returns {Object} c - Returns the input convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function reshape(c, shape, ma, mb, na, nb) {
	if (shape === 'full') {
		return c;
	} else if (shape === 'same') {
		const rowStart = Math.ceil((c.height - ma) / 2);
		const colStart = Math.ceil((c.width - na) / 2);

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
 * {
 *   data: [
 *     0.1838, 0.2374, 0.9727, 1.2644, 0.7890, 0.3750,
 *     0.6929, 1.2019, 1.5499, 2.1733, 1.3325, 0.3096,
 *     0.5627, 1.5150, 2.3576, 3.1553, 2.5373, 1.0602,
 *     0.9986, 2.3811, 3.4302, 3.5128, 2.4489, 0.8462,
 *     0.3089, 1.1419, 1.8229, 2.1561, 1.6364, 0.6841,
 *     0.3287, 0.9347, 1.6464, 1.7928, 1.2422, 0.5423
 *   ],
 *   width: 6,
 *   height: 6
 * }
 *
 * @example conv2(A,B,'same') => // output is the same size as A: 3-by-3
 * {
 *   data: [
 *     2.3576, 3.1553, 2.5373,
 *     3.4302, 3.5128, 2.4489,
 *     1.8229, 2.1561, 1.6364
 *   ],
 *   width: 3,
 *   height: 3
 * }
 *
 * @method conv2
 * @param {Array} args - The list of arguments, see `mxConv2` and `convn` for the exact parameters
 * @returns {Object} c - Returns the convolution filtered by `shape`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function conv2(...args) {
	if (args[2] && args[2].data) {
		return convn(...args);
	} else if (isBoxKernel(args[1])) {
		return boxConv(...args);
	}
	return mxConv2(...args);
}

module.exports = {
	conv2
};
