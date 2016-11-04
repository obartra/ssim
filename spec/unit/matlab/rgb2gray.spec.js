const test = require('blue-tape');
const { rgb2gray } = require('../../../src/matlab/rgb2gray');

test('should calculate luminance for RGB', (t) => {
	const luma = rgb2gray({ data: [100, 200, 50], width: 3, height: 1 })[0][0];

	t.equal(luma, 153);
	t.end();
});

test('should return the same value if all pixels are the same', (t) => {
	const luma = rgb2gray({ data: [200, 200, 200], width: 3, height: 1 })[0][0];

	t.equal(luma, 200);
	t.end();
});

test('should weight each color based on the ITU spec', (t) => {
	const rLuma = rgb2gray({ data: [100, 0, 0], width: 3, height: 1 })[0][0];
	const gLuma = rgb2gray({ data: [0, 100, 0], width: 3, height: 1 })[0][0];
	const bLuma = rgb2gray({ data: [0, 0, 100], width: 3, height: 1 })[0][0];

	t.equal(rLuma, 30);
	t.equal(gLuma, 59);
	t.equal(bLuma, 11);

	t.end();
});
