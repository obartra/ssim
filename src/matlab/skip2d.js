/**
 * Generates a matrix based on input `mx` but excluding items based on their modulo and their
 * position in the original matrix.
 *
 * It's a crude implementation of Matlab's `A(1:f:end,1:f:end)` syntax where the first parameter
 * is the matrix, the next one is an array describing the rows to skip [start position, every `f`
 * elements an end position] and the last one follows the same syntax for columns.
 *
 * @example
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
 * @param {Object} A - The input matrix
 * @returns {Object} B - The downsized matrix
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function skip2d(A, [startRow, everyRow, endRow], [startCol, everyCol, endCol]) {
	const data = [];
	const width = Math.ceil((endCol - startCol) / everyCol);
	const height = Math.ceil((endRow - startRow) / everyRow);

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			const Ai = startRow + i * everyRow;
			const Aj = startCol + j * everyCol;

			data[i * width + j] = A.data[Ai * A.width + Aj];
		}
	}

	return {
		data,
		width,
		height
	};
}

module.exports = {
	skip2d
};
