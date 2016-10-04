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

test('should create a gaussian low pass filter of different dimensions (fspecial)', (t) => {
	const fspecial3 = matlab.fspecial('gaussian', 3);
	const fspecial11 = matlab.fspecial('gaussian', 11);

	t.equal(fspecial3.length, 3);
	t.equal(fspecial3[0].length, 3);
	t.equal(round(fspecial3[0][0]), 0.095);
	t.equal(round(fspecial3[1][1]), 0.148);

	t.equal(fspecial11.length, 11);
	t.equal(fspecial11[0].length, 11);
	t.equal(round(fspecial11[0][0]), 0);
	t.equal(round(fspecial11[0][1]), 0);
	t.equal(round(fspecial11[5][5]), 0.071);

	t.end();
});

test('should create a matrix of the specified size with all zeros (zeros)', (t) => {
	const zeros = matlab.zeros(4);

	t.deepEqual(zeros, [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]);
	t.end();
});

test('should create a matrix of the specified size with all ones (ones)', (t) => {
	const ones = matlab.ones(4);

	t.deepEqual(ones, [
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1]
	]);
	t.end();
});

// test('should be equivalent to filter2 to symmetric filters and even matrices (imfilter)', (t) => {
// 	const mx = [
// 		[1, 2, 3, 4],
// 		[5, 6, 7, 8],
// 		[9, 0, 1, 2],
// 		[3, 4, 5, 6]
// 	];
// 	const f = [
// 		[0, 1],
// 		[1, 0]
// 	];
// 	const filter = matlab.filter2(f, mx, 'valid');
// 	const imfilter = matlab.imfilter(mx, f);

// 	t.deepEqual(filter, imfilter);
// 	t.end();
// });

// test('should ensure an odd number of rows / columns (imfilter)', (t) => {

// });

test('should get a window of a matrix (skip2d)', (t) => {
	const w = matlab.skip2d([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 1, 2], [1, 1, 2]);

	t.deepEqual(w, [[5]]);
	t.end();
});

test('should skip every n elements for the new matrix (skip2d)', (t) => {
	const w = matlab.skip2d([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [0, 2, 3], [0, 2, 3]);

	t.deepEqual(w, [[1, 3], [7, 9]]);
	t.end();
});

// filter2

test('should generate the convolution of "same" values by default (conv2)', (t) => {
	const A = [
		[0.4366211, 0.9054124, 0.5962102],
		[0.6371818, 0.1158246, 0.6470448],
		[0.0063498, 0.2951452, 0.6623801]
	];
	const B = [
		[0.180854, 0.650212, 0.848889, 0.661308],
		[0.098090, 0.877106, 0.662927, 0.242400],
		[0.625190, 0.318765, 0.920264, 0.668719],
		[0.873018, 0.264735, 0.082795, 0.516670]
	];
	const C = [
		[1.96772, 2.79944, 2.36862],
		[2.15222, 1.97551, 1.70072],
		[1.16234, 0.99710, 0.92035]
	];
	const out = matlab.conv2(A, B, 'same');

	t.deepEqual(out, C);
});
