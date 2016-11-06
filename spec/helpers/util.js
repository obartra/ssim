function imageDataToMx({ data: d, width, height, depth = 4 }) {
	const matrix = [];

	for (let i = 0; i < height; i++) {
		matrix[i] = [];
		for (let j = 0; j < width; j++) {
			const index = (j * height + i) * depth;

			if (depth === 1) {
				matrix[i][j] = d[index];
			} else {
				matrix[i][j] = [d[index], d[index + 1], d[index + 2], d[index + 3]];
			}
		}
	}

	return matrix;
}

function flatDataToMx({ data, width, height }) {
	return imageDataToMx({ data, width, height, depth: 1 });
}

function flatMxToData(mx = []) {
	return {
		data: [].concat(...mx),
		width: mx[0].length,
		height: mx.length
	};
}

module.exports = {
	imageDataToMx,
	flatDataToMx,
	flatMxToData
};
