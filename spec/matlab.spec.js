const test = require('blue-tape');
const matlab = require('../src/matlab');
const samples = require('./helpers/imageSamples.json');

function round(num) {
	return Math.round(num * 1000) / 1000;
}

test('should rotate 180 and generate the convolution (filter2)', (t) => {
	const conv2 = matlab
		.filter2(samples['11x11'].window, samples['11x11'].gray, 'valid')
		.map(x => x.map(round));

	t.deepEqual(conv2, samples['11x11'].conv2);
	t.end();
});

test('should rotate180 images with different dimensions (filter2)', (t) => {
	const conv2 = matlab
		.filter2(samples['24x18'].window, samples['24x18'].gray, 'valid')
		.map(x => x.map(round));

	t.deepEqual(conv2, samples['24x18'].conv2);
	t.end();
});

test('should calculate luminance for RGB (rgb2gray)', (t) => {
	const luma = matlab.rgb2gray([[[100, 200, 50]]])[0][0];

	t.equal(luma, 167.91);
	t.end();
});

test('should return the same value if all pixels are the same (rgb2gray)', (t) => {
	const luma = matlab.rgb2gray([[[200, 200, 200]]])[0][0];

	t.equal(luma, 200);
	t.end();
});

test('should weight each color based on the ITU spec (rgb2gray)', (t) => {
	const rLuma = matlab.rgb2gray([[[1, 0, 0]]])[0][0];
	const gLuma = matlab.rgb2gray([[[0, 1, 0]]])[0][0];
	const bLuma = matlab.rgb2gray([[[0, 0, 1]]])[0][0];

	t.equal(rLuma, 0.2126);
	t.equal(gLuma, 0.7152);
	t.equal(bLuma, 0.0722);

	t.end();
});
