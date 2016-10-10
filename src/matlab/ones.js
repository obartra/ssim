const { numbers } = require('./internal/numbers');

/**
 * Create a matrix of all ones
 *
 * This method mimics Matlab's `ones` method
 *
 * @method ones
 * @param {Number} m - The number of rows
 * @param {Number} [n=m] - The number of columns
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of ones
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function ones(m, n = m) {
	return numbers(m, n, 1);
}

module.exports = {
	ones
};
