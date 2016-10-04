const { sum2d, divide2d, floor } = require('./math');
const { getWindow } = require('./window');

/**
 * For an array of pixels of the form [r, g, b] it returns the equivalent grayscale color. These
 * values are derived from ITU's "Derivation of luminance singal (Page 4)' on:
 * http://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.709-6-201506-I!!PDF-E.pdf and match Matlab's
 * implementation
 *
 * @method luma
 * @param {Number[]} subpixels - The different pixels to use in the following order: r, g, b
 * @returns {Number} lumaValue - The value of the luminance for the [r,g,b] pixel
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function luma([r, g, b]) {
	return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

/**
 * Converts a 3d matrix of [row, column, rgb] into a 2d one [row, column] where the value is the
 * grayscale equivalent of the rgb input.
 *
 * This method mimics Matlab's `rgb2gray` method
 *
 * @method rgb2gray
 * @param {Array.<Array.<Array.<Number>>>} mx - The input matrix
 * @returns {Array.<Array.<Number>>} grayscale - A 2d grayscale representation of the input image
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function rgb2gray(mx) {
	const lumaMx = [];

	for (let x = 0; x < mx.length; x++) {
		lumaMx[x] = [];
		for (let y = 0; y < mx[x].length; y++) {
			lumaMx[x][y] = luma(mx[x][y]);
		}
	}
	return lumaMx;
}

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

/**
 * Create a matrix of all zeros
 *
 * This method mimics Matlab's `zeros` method
 *
 * @method zeros
 * @param {Number} m - The number of rows
 * @param {Number} [n=m] - The number of columns
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of zeros
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function zeros(m, n = m) {
	return numbers(m, n, 0);
}

/**
 * Create a matrix of all ones
 *
 * This method mimics Matlab's `ones` method
 *
 * @method ones
 * @param {Number} m - The number of rows
 * @param {Number} [n=m] - The number of columns
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of ones
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function ones(m, n = m) {
	return numbers(m, n, 1);
}

/**
 * Create a matrix with each cell with the value of `num`
 *
 * @method numbers
 * @param {Number} m - The number of rows
 * @param {Number} n - The number of columns
 * @param {Number} num - The value to set on each cell
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of `num`
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function numbers(m, n, num) {
	const out = [];

	for (let x = 0; x < m; x++) {
		out[x] = [];
		for (let y = 0; y < n; y++) {
			out[x][y] = num;
		}
	}
	return out;
}

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
 * This method mimics Matlab's `conv2` method with `shape = 'same'`. No other options have been
 * implemented and, if set, they will be ignored.
 *
 * @method conv2
 * @param {Array.<Array.<Number>>} a - The first matrix
 * @param {Array.<Array.<Number>>} b - The second matrix
 * @param {String} [shape='same'] - The shape value (always coerced to 'same')
 * @returns {Array.<Array.<Number>>} c - Returns the central part of the convolution of the same
 * size as `a`.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function conv2(a, b) {
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
	 * It's ~4x faster than a prior implementation that would get the subwindow, add, multiply and
	 * set the new sub window in separate objects on node v6.6
	 */
	for (let r1 = 0; r1 < mb; r1++) {
		for (let c1 = 0; c1 < nb; c1++) {
			const br1c1 = b[r1][c1];

			for (let i = 0; i < ma; i++) {
				for (let j = 0; j < na; j++) {
					c[i + c1][j + r1] += a[i][j] * br1c1;
				}
			}
		}
	}

	return getWindow(c, mb - 1, ma - mb + 1, nb - 1, na - nb + 1);
}

/**
 * Rotates a matrix 180deg. E.g.:
 *
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
function rotate1802d(b) {
	const out = [];
	const row = b.length;
	const col = b[0].length;

	for (let x = 0; x < row; x++) {
		out[x] = [];
		for (let y = 0; y < col; y++) {
			out[x][y] = b[row - 1 - x][col - 1 - y];
		}
	}

	return out;
}

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
 * `M = mod(X,Y)` returns the remainder `X - Y.*floor(X./Y)` for nonzero `Y`, and returns `X`
 * otherwise. `mod(X,Y)` always differs from `X` by a multiple of `Y`.
 *
 * So long as operands `X` and `Y` are of the same sign, the function `mod(X,Y)` returns the same
 * result as does `rem(X,Y)`. However, for positive `X` and `Y`, `mod(-x,y) = rem(-x,y)+y`.
 *
 * The mod function is useful for congruence relationships: x and y are congruent (mod m) if and
 * only if mod(x,m) == mod(y,m).
 *
 * This method mimics Matlab's `mod` method
 *
 * @method mod
 * @param {Number} x - The dividend
 * @param {Numvwe} y - The divisor
 * @returns {Number} M - Returns the signed remainder after division.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function mod(x, y) {
	return x - (y * Math.floor(x / y));
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
	return padVertical(padHorizontal(A, padCol), padRow);
}

/**
 * `B = imfilter(A,f)` filters a 2-dimensional array `A` with the 2-dimensional filter `f`. The
 * array `A`. The result `B` has the same size as `A`.
 *
 * `imfilter` computes each element of the output, `B`. If `A` is an integer, `imfilter` will not
 * truncates the output elements that exceed the range, and it will not rounds fractional values.
 *
 * This method mimics Matlab's `imfilter` method with `padval = 'symmetric'` and `res_size = 'same'`
 * and without integer rounding. No other options have been implemented and, if set, they will be
 * ignored.
 *
 * @method imfilter
 * @param {Array.<Array.<Number>>} A - The target matrix
 * @param {Array.<Array.<Number>>} f - The filter to apply
 * @returns {Array.<Array.<Number>>} B - The filtered array
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function imfilter(im, f, pad = 'symmetric', resSize = 'same') {
	const fcols = f.length;
	const frows = f[0].length;

	im = padarray(im, floor([frows / 2, fcols / 2]), pad);

	if (mod(frows, 2) === 0) {
		im = getWindow(im, 0, im.length - 1, 0, im[0].length);
	}

	if (mod(fcols, 2) === 0) {
		im = getWindow(im, 0, im.length, 0, im[0].length - 1);
	}

	if (resSize === 'same') {
		resSize = 'valid';
	}
	return filter2(f, im, resSize);
}

/**
 * Generates a matrix based on input `mx` but excluding items based on their modulo and their
 * position in the original matrix.
 *
 * It's a crude implementation of Matlab's `A(1:f:end,1:f:end)` syntax where the first parameter
 * is the matrix, the next one is an array describing the rows to skip [start position, every `f`
 * elements an end position] and the last one follows the same syntax for columns. E.g.:
 *
 * ```
 * img1(1:f:end,1:f:end)
 *
 * ```
 *
 * becomes:
 *
 * ```
 * skip2d(img1, [0, f, img1.length], [0, f, img1[0].length])
 * ```
 *
 * Note that the start index is 0 since, unlike Matlab's, arrays start at 0. Also, unlike in Matlab,
 * `f` must be an integer greater than or equal to 1.
 *
 * @method skip2d
 * @param {Array.<Array.<Number>>} h - The FIR filter
 * @returns {Array.<Array.<Number>>} X - The input matrix
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function skip2d(mx, [startRow, everyRow, endRow], [startCol, everyCol, endCol]) {
	const out = [];

	for (let x = 0; x < (endRow - startRow) / everyRow; x++) {
		out[x] = [];
		for (let y = 0; y < (endCol - startCol) / everyCol; y++) {
			out[x][y] = mx[startRow + x * everyRow][startCol + y * everyCol];
		}
	}

	return out;
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
 * @returns {Array.<Array.<Number>>} X - The input matrix
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function filter2(h, X, shape = 'same') {
	return conv2(X, rotate1802d(h), shape);
}

/**
 * Implements Matlab functions or functionality.
 *
 * The goal here is not a perfect reproduction of matlab logic but just a minimal implementation
 * needed to correctly reproduce the SSIM matlab script.
 *
 * That means that functionality used will be implemented but additional / unused parameters will
 * not.
 *
 * @namespace matlab
 */
module.exports = {
	fspecial,
	filter2,
	zeros,
	ones,
	imfilter,
	skip2d,
	rgb2gray
};
