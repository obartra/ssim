/**
 * Crops the matrix and returns a window at position `[x,y]` of size `[xlen, ylen]` from the input
 * matrix
 *
 * @method sub
 * @param {Object} A - The input matrix
 * @param {Number} x - The starting x offset
 * @param {Number} height - The vertical size of the window
 * @param {Number} y - The starting y offset
 * @param {Number} width - The horizontal size of the window
 * @returns {Object} B - The generated subwindow from matrix `c`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
function sub(A, x, height, y, width) {
	const data = new Array(width * height);

	let counter = 0;

	for (let i = y; i < y + height; i++) {
		for (let j = x; j < x + width; j++) {
			data[counter++] = A.data[i * A.width + j];
		}
	}

	return {
		data,
		width,
		height
	};
}

module.exports = {
	sub
};
