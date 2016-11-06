const { numbers } = require('./internal/numbers');

/**
 * Create a matrix of all zeros
 *
 * This method mimics Matlab's `zeros` method
 *
 * @method zeros
 * @param {Number} height - The height of the matrix (rows)
 * @param {Number} [width=height] - The width of the matrix (columns)
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of zeros
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function zeros(height, width = height) {
	return numbers(height, width, 0);
}

module.exports = {
	zeros
};
