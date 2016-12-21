const { mod } = require('./mod');

/**
 * Mirrors a matrix horizontally.
 *
 * @example
 * 1 2 3 4  becomes:  4 3 2 1
 * 5 6 7 8            8 7 6 5
 *
 * @method mirrorHorizonal
 * @param {Object} A - The input matrix
 * @returns {Object} B - The rotated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function mirrorHorizonal(A) {
	const data = new Array(A.data.length);

	for (let x = 0; x < A.height; x++) {
		for (let y = 0; y < A.width; y++) {
			data[x * A.width + y] = A.data[x * A.width + A.width - 1 - y];
		}
	}

	return {
		data,
		width: A.width,
		height: A.height
	};
}

/**
 * Mirrors a matrix vertically.
 *
 * @example
 * 1 2 3 4  becomes:  9 0 F E
 * 5 6 7 8            5 6 7 8
 * 9 0 F E            1 2 3 4
 *
 * @method mirrorVertical
 * @param {Object} A - The input matrix
 * @returns {Object} B - The rotated matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function mirrorVertical({ data: ref, width, height }) {
	const data = new Array(ref.length);

	for (let x = 0; x < height; x++) {
		for (let y = 0; y < width; y++) {
			data[x * width + y] = ref[(height - 1 - x) * width + y];
		}
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Concatenates 2 matrices of the same height horizontally.
 *
 * @example
 * 1 2   3 4  becomes:  1 2 3 4
 * 5 6   7 8            5 6 7 8
 *
 * @method concatHorizontal
 * @param {Object} A - The first matrix
 * @param {Object} B - The second matrix
 * @returns {Object} out - The combined matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function concatHorizontal(A, B) {
	const width = A.width + B.width;
	const data = new Array(A.height * width);

	for (let x = 0; x < A.height; x++) {
		for (let y = 0; y < A.width; y++) {
			data[x * width + y] = A.data[x * A.width + y];
		}
		for (let y = 0; y < B.width; y++) {
			data[x * width + y + A.width] = B.data[x * B.width + y];
		}
	}

	return {
		data,
		width,
		height: A.height
	};
}

/**
 * Concatenates 2 matrices of the same height vertically.
 *
 * @example
 * 1 2   3 4  becomes:  1 2
 * 5 6   7 8            5 6
 *                      3 4
 *                      7 8
 *
 * @method concatVertical
 * @param {Object} A - The first matrix
 * @param {Object} B - The second matrix
 * @returns {Object} out - The combined matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function concatVertical(A, B) {
	return {
		data: A.data.concat(B.data),
		height: A.height + B.height,
		width: A.width
	};
}

/**
 * Adds 2 * `pad` cells to a matrix horizontally. The values used are mirrored from the input
 * matrix.
 *
 * @example
 * with padding 1:
 * 1 2 3 4   becomes:  1 1 2 3 4 4
 * 5 6 7 8             5 5 6 7 8 8
 *
 * With padding 2:
 * 1 2 3 4   becomes:  2 1 1 2 3 4 4 3
 * 5 6 7 8             6 5 5 6 7 8 8 7
 *
 * @method padHorizontal
 * @param {Object} A - The input matrix
 * @param {Number} pad - The nummber of cells to add to each side (left / right)
 * @returns {Object} B - The padded matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function padHorizontal(A, pad) {
	const width = A.width + 2 * pad;
	const data = new Array(width * A.height);
	const mirrored = concatHorizontal(A, mirrorHorizonal(A));

	for (let x = 0; x < A.height; x++) {
		for (let y = -pad; y < A.width + pad; y++) {
			data[x * width + y + pad] = mirrored.data[x * mirrored.width + mod(y, mirrored.width)];
		}
	}

	return {
		data,
		width,
		height: A.height
	};
}

/**
 * Adds 2 * `pad` cells to a matrix vertically. The values used are mirrored from the input
 * matrix.
 *
 * @example
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
 * @param {Object} A - The input matrix
 * @param {Number} pad - The nummber of cells to add to each side (top / bottom)
 * @returns {Object} B - The padded matrix
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function padVertical(A, pad) {
	const mirrored = concatVertical(A, mirrorVertical(A));
	const height = A.height + pad * 2;
	const data = new Array(A.width * height);

	for (let x = -pad; x < A.height + pad; x++) {
		for (let y = 0; y < A.width; y++) {
			data[(x + pad) * A.width + y] = mirrored.data[mod(x, mirrored.height) * A.width + y];
		}
	}

	return {
		data,
		width: A.width,
		height
	};
}

/**
 * Implements `padarray` matching Matlab only for the case where:
 *
 * `padHeight <= A.height && padWidth <= A.width`
 *
 * For an input Matrix `E`, we add padding A, B, C, D, F, G, H and I of size `padHeight` and
 * `padWidth` where appropriate. For instance, given E:
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
 * @param {Object} A - The input matrix
 * @param {Array} padding - An array where the first element is the padding to apply to each side on
 * each row and the second one is the vertical padding for each side of each column
 * @returns {Object} B - The padded matrix
 * @private
 * @memberOf matlab
 * @since 0.0.4
 */
function fastPadding(A, padHeight, padWidth) {
	const width = A.width + padWidth * 2;
	const height = A.height + padHeight * 2;
	const data = new Array(width * height);

	for (let x = -padHeight; x < 0; x++) {
		// A
		for (let y = -padWidth; y < 0; y++) {
			data[(x + padHeight) * width + y + padWidth] = A.data[(-x - 1) * A.width - y - 1];
		}
		// B
		for (let y = 0; y < A.width; y++) {
			data[(x + padHeight) * width + y + padWidth] = A.data[(-x - 1) * A.width + y];
		}
		// C
		for (let y = A.width; y < A.width + padWidth; y++) {
			data[(x + padHeight) * width + y + padWidth] =
				A.data[(-x - 1) * A.width + 2 * A.width - y - 1];
		}
	}

	for (let x = 0; x < A.height; x++) {
		// D
		for (let y = -padWidth; y < 0; y++) {
			data[(x + padHeight) * width + y + padWidth] = A.data[x * A.width - y - 1];
		}
		// E
		for (let y = 0; y < A.width; y++) {
			data[(x + padHeight) * width + y + padWidth] = A.data[x * A.width + y];
		}
		// F
		for (let y = A.width; y < A.width + padWidth; y++) {
			data[(x + padHeight) * width + y + padWidth] = A.data[x * A.width + 2 * A.width - y - 1];
		}
	}

	for (let x = A.height; x < A.height + padHeight; x++) {
		// G
		for (let y = -padWidth; y < 0; y++) {
			data[(x + padHeight) * width + y + padWidth] =
				A.data[(2 * A.height - x - 1) * A.width - y - 1];
		}
		// H
		for (let y = 0; y < A.width; y++) {
			data[(x + padHeight) * width + y + padWidth] =
				A.data[(2 * A.height - x - 1) * A.width + y];
		}
		// I
		for (let y = A.width; y < A.width + padWidth; y++) {
			data[(x + padHeight) * width + y + padWidth] =
				A.data[(2 * A.height - x - 1) * A.width + 2 * A.width - y - 1];
		}
	}

	return {
		data,
		width,
		height
	};
}

/**
 * `B = padarray(A,padHeight,padWidth)` pads array `A`. padsize values are nonnegative integers that
 * specify the amount of padding to add.
 *
 * For example, a padHeight and a padWidth of `2` and `3` means add 2 elements of padding along the
 * first dimension and 3 elements of padding along the second dimension.
 *
 * By default, paddarray adds padding before the first element and after the last element along the
 * specified dimension.
 *
 * This method mimics Matlab's `padarray` method with `padval = 'symmetric'` and
 * `direction = 'both'`. No other options have been implemented and, if set, they will be ignored.
 *
 * @method padarray
 * @param {Object} A - The target matrix
 * @param {Number} padHeight - The horizontal padding to apply to each side on each row
 * @param {Number} padWidth - The vertical padding for each side of each column
 * @param {String} [padval='symmetric'] - The type of padding to apply (coerced to 'symmetric')
 * @param {String} [direction='both'] - The direction to which apply padding (coerced to 'both')
 * @returns {Object} c - An array with padding added on each side.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function padarray(A, padHeight, padWidth) {
	// If the padding to mirror is not greater than `A` dimensions, we can use `fastPadding`,
	// otherwise we fall back to a slower implementation that mimics Matlab behavior for longer
	// matrices
	if (A.height >= padHeight && A.width >= padWidth) {
		return fastPadding(A, padHeight, padWidth);
	}
	return padVertical(padHorizontal(A, padWidth), padHeight);
}

module.exports = {
	padarray
};
