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
	const out = new Array(xn.length);

	for (let x = 0; x < xn.length; x++) {
		out[x] = Math.floor(xn[x]);
	}

	return out;
}

/**
 * Computes the sum of all elements within a matrix
 *
 * @method sum2d
 * @param {Object} A - The input matrix
 * @returns {Number} sum - The total value of adding each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function sum2d({ data }) {
	let out = 0;

	for (let x = 0; x < data.length; x++) {
		out += data[x];
	}

	return out;
}

/**
 * Adds values of two matrices of the same size
 *
 * @method add2dMx
 * @param {Object} A - The first input matrix
 * @param {Object} B - The second input matrix
 * @returns {Object} out - A matrix with a cell-by-cell sum of `A` and `B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dMx({ data: ref1, width, height }, { data: ref2 }) {
	const data = new Array(ref1.length);

	for (let x = 0; x < height; x++) {
		const offset = x * width;

		for (let y = 0; y < width; y++) {
			data[offset + y] = ref1[offset + y] + ref2[offset + y];
		}
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Adds a constant value two each matrix cell
 *
 * @method add2dScalar
 * @param {Object} A - The first input matrix
 * @param {Number} increase - The value to add
 * @returns {Object} B - The cell-by-cell matrix sum of `A` and `increase`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dScalar({ data: ref, width, height }, increase) {
	const data = new Array(ref.length);

	for (let x = 0; x < ref.length; x++) {
		data[x] = ref[x] + increase;
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Adds values of two matrices of the same size or a matrix and a constant
 *
 * @method add2d
 * @param {Object} A - The first input matrix
 * @param {Object|Number} increase - The second input matrix or the constant value
 * @returns {Object} B - A matrix with a cell-by-cell sum of the first and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function add2d(A, increase) {
	if (typeof increase === 'number') {
		return add2dScalar(A, increase);
	}
	return add2dMx(A, increase);
}

/**
 * Divides each matrix cell by a constant value
 *
 * @method divide2dScalar
 * @param {Object} A - The first input matrix
 * @param {Number} divisor - The value to divide by
 * @returns {Object} B - The cell-by-cell matrix divison of `A` and `divisor`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dScalar({ data: ref, width, height }, divisor) {
	const data = new Array(ref.length);

	for (let x = 0; x < ref.length; x++) {
		data[x] = ref[x] / divisor;
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Divides, cell-by-cell, values of two matrices of the same size
 *
 * @method divide2dMx
 * @param {Object} A - The first input matrix
 * @param {Object} B - The second input matrix
 * @returns {Object} out - A matrix with a cell-by-cell division of `A`/`B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dMx({ data: ref1, width, height }, { data: ref2 }) {
	const data = new Array(ref1.length);

	for (let x = 0; x < ref1.length; x++) {
		data[x] = ref1[x] / ref2[x];
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Divides values of two matrices of the same size or between a matrix and a constant
 *
 * @method divide2d
 * @param {Object} A - The first input matrix
 * @param {Object|Number} divisor - The second input matrix or the constant value
 * @returns {Object} B - A matrix with the cell-by-cell division of the first and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function divide2d(A, divisor) {
	if (typeof divisor === 'number') {
		return divide2dScalar(A, divisor);
	}
	return divide2dMx(A, divisor);
}

/**
 * Multiplies each matrix cell by a constant value
 *
 * @method multiply2dScalar
 * @param {Object} A - The first input matrix
 * @param {Number} multiplier - The value to multiply each cell with
 * @returns {Object} B - The cell-by-cell matrix multiplication of `A` and `multiplier`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dScalar({ data: ref, width, height }, multiplier) {
	const data = new Array(ref.length);

	for (let x = 0; x < ref.length; x++) {
		data[x] = ref[x] * multiplier;
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Multiplies, cell-by-cell, values of two matrices of the same size
 *
 * @method multiply2dMx
 * @param {Object} A - The first input matrix
 * @param {Object} B - The second input matrix
 * @returns {Object} out - A matrix with a cell-by-cell multiplication of `A` * `B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dMx({ data: ref1, width, height }, { data: ref2 }) {
	const data = new Array(ref1.length);

	for (let x = 0; x < ref1.length; x++) {
		data[x] = ref1[x] * ref2[x];
	}

	return {
		data,
		width,
		height
	};
}

/**
 * Multiplies values of two matrices of the same size or between a matrix and a constant
 *
 * @method multiply2d
 * @param {Object} A - The first input matrix
 * @param {Object|Number} multiplier - The second input matrix or the constant value
 * @returns {Object} out - A matrix with the cell-by-cell multiplication of the first and second
 * parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function multiply2d(A, multiplier) {
	if (typeof multiplier === 'number') {
		return multiply2dScalar(A, multiplier);
	}
	return multiply2dMx(A, multiplier);
}

/**
 * Generates the cell-by-cell square value of a target matrix
 *
 * @method square2d
 * @param {Object} A - The target matrix
 * @returns {Object} B - A matrix with squared value of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function square2d(A) {
	return multiply2d(A, A);
}

/**
 * Calculates the total mean value for a given matrix
 *
 * @method mean2d
 * @param {Array.<Array.<Number>>} A - The target matrix
 * @returns {Number} mean - The total mean of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
function mean2d(A) {
	return sum2d(A) / A.data.length;
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
	add2d,
	average,
	divide2d,
	floor,
	mean2d,
	multiply2d,
	square2d,
	sum,
	sum2d
};
