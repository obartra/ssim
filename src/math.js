/**
 * Computes the mean value of a given array. It is the sum of a list of numbers divided by the
 * number of numbers in the list.
 *
 * @method average
 * @param {Number[]} xn - The target array
 * @returns {Number} average - The mean value of all elements within the array
 * @public
 * @memberOf math
 * @since 0.0.1
 */
function average(xn) {
	return sum(xn) / xn.length;
}

/**
 * Computes the sum of a given array. It adds all values within the array and returns the total
 *
 * @method sum
 * @param {Number[]} xn - The target array
 * @returns {Number} sum - The total value
 * @private
 * @memberOf math
 * @since 0.0.1
 */
function sum(xn) {
	let out = 0;

	for (let x = 0; x < xn.length; x++) {
		out += xn[x];
	}
	return out;
}

/**
 * Computes the largest integer less than or equal to a given number for each member of a given
 * array.
 *
 * @method floor
 * @param {Number[]} xn - The target array
 * @returns {Number[]} floorArr - An array with the Math.floor value for each element of the target
 * array
 * @private
 * @memberOf math
 * @since 0.0.1
 */
function floor(xn) {
	const out = [];

	for (let x = 0; x < xn.length; x++) {
		out[x] = Math.floor(xn[x]);
	}

	return out;
}

/**
 * Computes the sum of all elements within a matrix
 *
 * @method sum2d
 * @param {Array.<Array.<Number>>} mx - The input matrix
 * @returns {Number} sum - The total value of adding each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function sum2d(mx) {
	let out = 0;

	for (let x = 0; x < mx.length; x++) {
		for (let y = 0; y < mx[0].length; y++) {
			out += mx[x][y];
		}
	}

	return out;
}

/**
 * Adds values of two matrices of the same size
 *
 * @method add2dMx
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>} mx2 - The second input matrix
 * @returns {Array.<Array.<Number>>} sumMx - A matrix with a cell-by-cell sum of `mx1` and `mx2`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dMx(mx1, mx2) {
	const out = [];

	for (let x = 0; x < mx1.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx1[0].length; y++) {
			out[x][y] = mx1[x][y] + mx2[x][y];
		}
	}

	return out;
}

/**
 * Adds a constant value two each matrix cell
 *
 * @method add2dScalar
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Number} increase - The value to add
 * @returns {Array.<Array.<Number>>} sumMx - The cell-by-cell matrix sum of `mx1` and `increase`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dScalar(mx, increase) {
	const out = [];

	for (let x = 0; x < mx.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx[0].length; y++) {
			out[x][y] = mx[x][y] + increase;
		}
	}

	return out;
}

/**
 * Adds values of two matrices of the same size or a matrix and a constant
 *
 * @method add2d
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>|Number} increase - The second input matrix or the constant value
 * @returns {Array.<Array.<Number>>} sumMx - A matrix with a cell-by-cell sum of the first and
 * second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function add2d(mx, increase) {
	if (typeof increase === 'number') {
		return add2dScalar(mx, increase);
	}
	return add2dMx(mx, increase);
}

/**
 * Divides each matrix cell by a constant value
 *
 * @method divide2dScalar
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Number} divisor - The value to divide by
 * @returns {Array.<Array.<Number>>} dividedMx - The cell-by-cell matrix divison of `mx1` and
 * `divisor`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dScalar(mx, divisor) {
	const out = [];

	for (let x = 0; x < mx.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx[0].length; y++) {
			out[x][y] = mx[x][y] / divisor;
		}
	}

	return out;
}

/**
 * Divides, cell-by-cell, values of two matrices of the same size
 *
 * @method divide2dMx
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>} mx2 - The second input matrix
 * @returns {Array.<Array.<Number>>} divideMx - A matrix with a cell-by-cell division of `mx1`/`mx2`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dMx(mx1, mx2) {
	const out = [];

	for (let x = 0; x < mx1.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx1[0].length; y++) {
			out[x][y] = mx1[x][y] / mx2[x][y];
		}
	}

	return out;
}

/**
 * Divides values of two matrices of the same size or between a matrix and a constant
 *
 * @method divide2d
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>|Number} divisor - The second input matrix or the constant value
 * @returns {Array.<Array.<Number>>} divideMx - A matrix with the cell-by-cell division of the first
 * and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function divide2d(mx, divisor) {
	if (typeof divisor === 'number') {
		return divide2dScalar(mx, divisor);
	}
	return divide2dMx(mx, divisor);
}

/**
 * Multiplies each matrix cell by a constant value
 *
 * @method multiply2dScalar
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Number} multiplier - The value to multiply each cell with
 * @returns {Array.<Array.<Number>>} multMx - The cell-by-cell matrix multiplication of `mx1`
 * and `multiplier`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dScalar(mx, multiplier) {
	const out = [];

	for (let x = 0; x < mx.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx[0].length; y++) {
			out[x][y] = mx[x][y] * multiplier;
		}
	}

	return out;
}

/**
 * Multiplies, cell-by-cell, values of two matrices of the same size
 *
 * @method multiply2dMx
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>} mx2 - The second input matrix
 * @returns {Array.<Array.<Number>>} multMx - A matrix with a cell-by-cell multiplication of
 * `mx1` * `mx2`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dMx(mx1, mx2) {
	const out = [];

	for (let x = 0; x < mx1.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx1[0].length; y++) {
			out[x][y] = mx1[x][y] * mx2[x][y];
		}
	}

	return out;
}

/**
 * Multiplies values of two matrices of the same size or between a matrix and a constant
 *
 * @method multiply2d
 * @param {Array.<Array.<Number>>} mx1 - The first input matrix
 * @param {Array.<Array.<Number>>|Number} multiplier - The second input matrix or the constant value
 * @returns {Array.<Array.<Number>>} multMx - A matrix with the cell-by-cell multiplication of the
 * first and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function multiply2d(mx, multiplier) {
	if (typeof multiplier === 'number') {
		return multiply2dScalar(mx, multiplier);
	}
	return multiply2dMx(mx, multiplier);
}

/**
 * Generates the cell-by-cell square value of a target matrix
 *
 * @method square2d
 * @param {Array.<Array.<Number>>} mx - The target matrix
 * @returns {Array.<Array.<Number>>} squareMx - A matrix with squared value of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function square2d(mx) {
	const out = [];

	for (let x = 0; x < mx.length; x++) {
		out[x] = [];
		for (let y = 0; y < mx[0].length; y++) {
			out[x][y] = Math.pow(mx[x][y], 2);
		}
	}

	return out;
}

/**
 * Calculates the total mean value for a given matrix
 *
 * @method mean2d
 * @param {Array.<Array.<Number>>} mx - The target matrix
 * @returns {Number} mean - The total mean of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function mean2d(mx) {
	return sum2d(mx) / (mx.length * mx[0].length);
}

/**
 * Generates all basic arithmetic and matrix computations required
 *
 * Most of these methods use plain for loops and reduce nested calls. This results in about ~100x
 * improvement on SSIM computation for 512x512 images on recent versions of node (~v6.7) over
 * implementations using map or reduce.
 *
 * @namespace math
 */
module.exports = {
	average,
	sum2d,
	add2d,
	divide2d,
	multiply2d,
	square2d,
	mean2d,
	floor
};
