/**
 * Create a matrix with each cell with the value of `num`
 *
 * @method numbers
 * @param {Number} height - The number of rows
 * @param {Number} width - The number of columns
 * @param {Number} num - The value to set on each cell
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of `num`
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
function numbers(height, width, num) {
	const data = [];

	for (let x = 0; x < width * height; x++) {
		data[x] = num;
	}
	return {
		data,
		width,
		height
	};
}

module.exports = {
	numbers
};
