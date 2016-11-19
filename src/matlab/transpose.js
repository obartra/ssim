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
function transpose({ data: ref, width, height }) {
	const data = new Array(width * height);

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			data[j * height + i] = ref[i * width + j];
		}
	}

	return {
		data,
		height: width,
		width: height
	};
}

module.exports = {
	transpose
};
