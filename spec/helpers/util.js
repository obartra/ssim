function imageDataToMx({ data: d, width, height, depth = 4 }) {
	const matrix = [];

	for (let x = 0; x < width; x++) {
		matrix[x] = [];
		for (let y = 0; y < height; y++) {
			const index = (x + y * width) * depth;

			if (depth === 1) {
				matrix[x][y] = d[index];
			} else {
				matrix[x][y] = [d[index], d[index + 1], d[index + 2], d[index + 3]];
			}
		}
	}

	return matrix;
}

module.exports = {
	imageDataToMx
};
