const { numbers } = require('./internal/numbers')

/**
 * Create a matrix of all ones
 *
 * This method mimics Matlab's `ones` method
 *
 * @method ones
 * @param {Number} height - The height of the matrix (rows)
 * @param {Number} [width=height] - The width of the matrix (columns)
 * @returns {Array.<Array.<Number>>} B - An n-by-m matrix of ones
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function ones(height, width = height) {
  return numbers(height, width, 1)
}

module.exports = {
  ones,
}
