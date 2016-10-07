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

module.exports = {
	numbers
};
