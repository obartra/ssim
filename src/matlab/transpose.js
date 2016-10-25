const { zeros } = require('./zeros');

/**
 * Transposes a vector or a matrix
 *
 * This method mimics Matlab's `transpose` method (which equals to the `A.'` syntax)
 *
 * `B = A.'` returns the nonconjugate transpose of A, that is, interchanges the row and column index
 * for each element.
 *
 * This method does not handle complex or imaginary numbers
 * This method always returns a matrix
 *
 * @method transpose
 * @param {Array.<Array.<Number>>|Array.<Number>} A - The matrix or vector to transpose
 * @returns {Array.<Array.<Number>>} B - The transposed matrix
 * @public
 * @memberOf matlab
 */
function transpose(A) {
	const isVector = typeof A[0] === 'number';

	if (isVector) {
		A = [A];
	}

	const B = zeros(A[0].length, A.length);

	for (let i = 0; i < A.length; i++) {
		for (let j = 0; j < A[0].length; j++) {
			B[j][i] = A[i][j];
		}
	}

	return B;
}

module.exports = {
	transpose
};
