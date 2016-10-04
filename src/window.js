function getWindow(c, y, ylen, x, xlen) {
	const out = [];

	for (let i = 0; i < ylen; i++) {
		out[i] = [];
		for (let j = 0; j < xlen; j++) {
			out[i][j] = c[i + x][j + y];
		}
	}

	return out;
}

/**
 * Methods related to window size and position
 *
 * @namespace window
 */
module.exports = {
	getWindow
};
