/**
 * Crops the matrix and returns a window at position `[x,y]` of size `[xlen, ylen]` from the input
 * matrix
 *
 * @method sub
 * @param {Array.<Array.<Number>>} c - The input matrix
 * @param {Number} y - The starting y offset
 * @param {Number} ylen - The vertical size of the window
 * @param {Number} x - The starting x offset
 * @param {Number} xlen - The horizontal size of the window
 * @returns {Array.<Array.<Number>>} out - The generated subwindow from matrix `c`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function sub(c, y, ylen, x, xlen) {
	const out = [];

	for (let i = 0; i < ylen; i++) {
		out[i] = [];
		for (let j = 0; j < xlen; j++) {
			out[i][j] = c[i + x][j + y];
		}
	}

	return out;
}

module.exports = {
	sub
};
