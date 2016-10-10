const { zeros } = require('./zeros');
const { mod } = require('./mod');

/**
 * Mirrors a matrix horizontally. E.g.:
 *
 * 1 2 3 4  becomes:  4 3 2 1
 * 5 6 7 8            8 7 6 5
 *
 * @method mirrorHorizonal
 * @param {Array.<Array.<Number>>} b - The input matrix
 * @returns {Array.<Array.<Number>>} out - The rotated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function mirrorHorizonal(b) {
	const out = [];
	const row = b.length;
	const col = b[0].length;

	for (let x = 0; x < row; x++) {
		out[x] = [];
		for (let y = 0; y < col; y++) {
			out[x][y] = b[x][col - 1 - y];
		}
	}

	return out;
}

/**
 * Mirrors a matrix vertically. E.g.:
 *
 * 1 2 3 4  becomes:  9 0 F E
 * 5 6 7 8            5 6 7 8
 * 9 0 F E            1 2 3 4
 *
 * @method mirrorVertical
 * @param {Array.<Array.<Number>>} b - The input matrix
 * @returns {Array.<Array.<Number>>} out - The rotated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function mirrorVertical(b) {
	const out = [];
	const row = b.length;
	const col = b[0].length;

	for (let x = 0; x < row; x++) {
		out[x] = [];
		for (let y = 0; y < col; y++) {
			out[x][y] = b[row - 1 - x][y];
		}
	}

	return out;
}

/**
 * Concatenates 2 matrices of the same height horizontally. E.g.:
 *
 * 1 2   3 4  becomes:  1 2 3 4
 * 5 6   7 8            5 6 7 8
 *
 * @method concatHorizontal
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Array.<Number>>} b - The second matrix
 * @returns {Array.<Array.<Number>>} out - The combined matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function concatHorizontal(a, b) {
	const out = [];

	for (let x = 0; x < a.length; x++) {
		out[x] = [];
		for (let y = 0; y < a[0].length; y++) {
			out[x][y] = a[x][y];
		}
		for (let y = 0; y < b[0].length; y++) {
			out[x][y + a[0].length] = b[x][y];
		}
	}
	return out;
}

/**
 * Concatenates 2 matrices of the same height vertically. E.g.:
 *
 * 1 2   3 4  becomes:  1 2
 * 5 6   7 8            5 6
 *                      3 4
 *                      7 8
 *
 * @method concatVertical
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Array.<Number>>} b - The second matrix
 * @returns {Array.<Array.<Number>>} out - The combined matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function concatVertical(a, b) {
	const out = zeros(a.length + b.length, a[0].length);

	for (let y = 0; y < a[0].length; y++) {
		for (let x = 0; x < a.length; x++) {
			out[x][y] = a[x][y];
		}
		for (let x = 0; x < b.length; x++) {
			out[x + a.length][y] = b[x][y];
		}
	}
	return out;
}

/**
 * Adds 2 * `pad` cells to a matrix horizontally. The values used are mirrored from the input
 * matrix. E.g.:
 *
 * with padding 1:
 * 1 2 3 4   becomes:  1 1 2 3 4 4
 * 5 6 7 8             5 5 6 7 8 8
 *
 * With padding 2:
 * 1 2 3 4   becomes:  2 1 1 2 3 4 4 3
 * 5 6 7 8             6 5 5 6 7 8 8 7
 *
 * @method padHorizontal
 * @param {Array.<Array.<Number>>} A - The input matrix
 * @param {Number} pad - The nummber of cells to add to each side (left / right)
 * @returns {Array.<Array.<Number>>} out - The padded matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function padHorizontal(A, pad) {
	const out = [];
	const mirrored = concatHorizontal(A, mirrorHorizonal(A));
	const mirrorCol = mirrored[0].length;
	const col = A[0].length;

	for (let x = 0; x < A.length; x++) {
		out[x] = [];
		for (let y = -pad; y < col + pad; y++) {
			out[x][y + pad] = mirrored[x][mod(y, mirrorCol)];
		}
	}

	return out;
}

/**
 * Adds 2 * `pad` cells to a matrix vertically. The values used are mirrored from the input
 * matrix. E.g.:
 *
 * with padding 1:
 * 1 2 3 4   becomes:  1 2 3 4
 * 5 6 7 8             1 2 3 4
 *                     5 6 7 8
 *                     5 6 7 8
 * With padding 2:
 * 1 2 3 4   becomes:  5 6 7 8
 * 5 6 7 8             1 2 3 4
 *                     1 2 3 4
 *                     5 6 7 8
 *                     5 6 7 8
 *                     1 2 3 4
 *
 * @method padVertical
 * @param {Array.<Array.<Number>>} A - The input matrix
 * @param {Number} pad - The nummber of cells to add to each side (top / bottom)
 * @returns {Array.<Array.<Number>>} out - The padded matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function padVertical(A, pad) {
	const out = [];
	const mirrored = concatVertical(A, mirrorVertical(A));
	const mirrorRow = mirrored.length;
	const row = A.length;

	for (let x = -pad; x < row + pad; x++) {
		out[x + pad] = [];
		for (let y = 0; y < A[0].length; y++) {
			out[x + pad][y] = mirrored[mod(x, mirrorRow)][y];
		}
	}
	return out;
}

/**
 * Implements `padarray` matching Matlab only for the case where:
 *
 * `padRow <= A.length && padCol <= A[0].length`
 *
 * For an input Matrix `E`, we add padding A, B, C, D, F, G, H and I of size `padRow` and `padCol`
 * where appropriate. For instance, given E:
 *
 * 1 2 3
 * 4 5 6
 *
 * Placed in a padding matrix like this:
 *
 * | A | B | C |
 * |---|---|---|
 * | D | E | F |
 * |---|---|---|
 * | G | H | I |
 *
 * with padding [1, 1] it becomes:
 *
 * | 1 | 1 2 3 | 3 |
 * |---|-------|---|
 * | 1 | 1 2 3 | 3 |
 * | 4 | 4 5 6 | 6 |
 * |---|-------|---|
 * | 4 | 4 5 6 | 6 |
 *
 * with padding [2, 3] it becomes:
 *
 * | 6 5 4 | 4 5 6 | 6 5 4 |
 * | 3 2 1 | 1 2 3 | 3 2 1 |
 * |-------|-------|-------|
 * | 3 2 1 | 1 2 3 | 3 2 1 |
 * | 6 5 4 | 4 5 6 | 6 5 4 |
 * |-------|-------|-------|
 * | 6 5 4 | 4 5 6 | 6 5 4 |
 * | 3 2 1 | 1 2 3 | 3 2 1 |
 *
 * @method fastPadding
 * @param {Array.<Array.<Number>>} out - The initialized, but empty, output padded matrix
 * @param {Array.<Array.<Number>>} A - The input matrix
 * @param {Number} pad - The nummber of cells to add to each side (top / bottom)
 * @param {Array} padding - An array where the first element is the padding to apply to each side on
 * each row and the second one is the vertical padding for each side of each column
 * @returns {Array.<Array.<Number>>} out - An array with padding added on each side.
 * @private
 * @memberOf matlab
 * @since 0.0.4
 */
function fastPadding(out, A, [padRow, padCol]) {
	for (let x = -padRow; x < 0; x++) {
		// A
		for (let y = -padCol; y < 0; y++) {
			out[x + padRow][y + padCol] = A[Math.abs(x) - 1][Math.abs(y) - 1];
		}
		// B
		for (let y = 0; y < A[0].length; y++) {
			out[x + padRow][y + padCol] = A[Math.abs(x) - 1][y];
		}
		// C
		for (let y = A[0].length; y < A[0].length + padCol; y++) {
			out[x + padRow][y + padCol] = A[Math.abs(x) - 1][2 * A[0].length - y - 1];
		}
	}
	for (let x = 0; x < A.length; x++) {
		// D
		for (let y = -padCol; y < 0; y++) {
			out[x + padRow][y + padCol] = A[x][Math.abs(y) - 1];
		}
		// E
		for (let y = 0; y < A[0].length; y++) {
			out[x + padRow][y + padCol] = A[x][y];
		}
		// F
		for (let y = A[0].length; y < A[0].length + padCol; y++) {
			out[x + padRow][y + padCol] = A[x][2 * A[0].length - y - 1];
		}
	}
	for (let x = A.length; x < A.length + padRow; x++) {
		// G
		for (let y = -padCol; y < 0; y++) {
			out[x + padRow][y + padCol] = A[2 * A.length - x - 1][Math.abs(y) - 1];
		}
		// H
		for (let y = 0; y < A[0].length; y++) {
			out[x + padRow][y + padCol] = A[2 * A.length - x - 1][y];
		}
		// I
		for (let y = A[0].length; y < A[0].length + padCol; y++) {
			out[x + padRow][y + padCol] = A[2 * A.length - x - 1][2 * A[0].length - y - 1];
		}
	}
	return out;
}

/**
 * `B = padarray(A,padsize)` pads array `A`. padsize is a vector of nonnegative integers that
 * specifies both, the amount of padding to add and the dimension along which to add it. The value
 * of an element in the vector specifies the amount of padding to add. The order of the element in
 * the vector specifies the dimension along which to add the padding.
 *
 * For example, a padsize value of `[2 3]` means add 2 elements of padding along the first dimension
 * and 3 elements of padding along the second dimension.
 *
 * By default, paddarray adds padding before the first element and after the last element along the
 * specified dimension.
 *
 * `B = padarray(A,padsize,padval)` pads array `A` where `padval` specifies the value to use as the
 * pad value. `padval` can only be 'symmetric' for this implementation of `padarray` which will pad
 * the array with mirror reflections of itself.
 *
 * This method mimics Matlab's `padarray` method with `padval = 'symmetric'` and
 * `direction = 'both'`. No other options have been implemented and, if set, they will be ignored.
 *
 * This method has been unfolded for performance and switched to simple for loops. Readability
 * suffers.
 *
 * @method padarray
 * @param {Array.<Array.<Number>>} A - The target matrix
 * @param {Array} padding - An array where the first element is the padding to apply to each side on
 * each row and the second one is the vertical padding for each side of each column
 * @param {String} [padval='symmetric'] - The type of padding to apply (coerced to 'symmetric')
 * @param {String} [direction='both'] - The direction to which apply padding (coerced to 'both')
 * @returns {Array.<Array.<Number>>} c - An array with padding added on each side.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function padarray(A, [padRow, padCol]) {
	// If the padding to mirror is not greater than `A` dimensions, we can use `fastPadding`,
	// otherwise we fall back to a slower implementation that mimics Matlab behavior for longer
	// matrices
	if (A.length >= padRow && A[0].length >= padCol) {
		const c = [];

		for (let x = 0; x < A.length + padRow * 2; x++) {
			c[x] = [];
		}
		return fastPadding(c, A, [padRow, padCol]);
	}
	return padVertical(padHorizontal(A, padCol), padRow);
}

module.exports = {
	padarray
};
