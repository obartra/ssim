const { numbers } = require('./internal/numbers');

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

module.exports = {
	zeros
};
