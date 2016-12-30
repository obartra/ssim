/**
 * Transposes a vector or a matrix
 *
 * This method mimics Matlab's `transpose` method (which equals to the `A.'` syntax)
 *
 * `B = A.'` returns the nonconjugate transpose of A, that is, interchanges the row and column index
 * for each element.
 *
 * This method does not handle complex or imaginary numbers
 *
 * @method transpose
 * @param {Object} A - The matrix to transpose
 * @returns {Object} B - The transposed matrix
 * @public
 * @memberOf matlab
 */
function transpose(A) {
	const data = new Array(A.width * A.height);

	for (let i = 0; i < A.height; i++) {
		for (let j = 0; j < A.width; j++) {
			data[j * A.height + i] = A.data[i * A.width + j];
		}
	}

	return {
		data,
		height: A.width,
		width: A.height
	};
}

module.exports = {
	transpose
};
