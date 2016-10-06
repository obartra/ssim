const test = require('blue-tape');
const matlab = require('../src/matlab');
const samples = require('./helpers/imageSamples.json');
const { round, roundTo } = require('./helpers/round');

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

	t.equal(luma, 153);
	t.end();
});

test('should return the same value if all pixels are the same (rgb2gray)', (t) => {
	const luma = matlab.rgb2gray([[[200, 200, 200]]])[0][0];

	t.equal(luma, 200);
	t.end();
});

test('should weight each color based on the ITU spec (rgb2gray)', (t) => {
	const rLuma = matlab.rgb2gray([[[100, 0, 0]]])[0][0];
	const gLuma = matlab.rgb2gray([[[0, 100, 0]]])[0][0];
	const bLuma = matlab.rgb2gray([[[0, 0, 100]]])[0][0];

	t.equal(rLuma, 30);
	t.equal(gLuma, 59);
	t.equal(bLuma, 11);

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

test('should generate the same matrix with a kernel of 1', (t) => {
	const A = [
		[0.4366211, 0.9054124, 0.5962102],
		[0.6371818, 0.1158246, 0.6470448],
		[0.0063498, 0.2951452, 0.6623801]
	];
	const B = [
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0]
	];
	const out = matlab.conv2(A, B, 'same');

	t.deepEqual(out, A);
	t.end();
});

test('should offset and divide the matrix with a moved kernel of 0.5', (t) => {
	const A = [
		[0.4366211, 0.9054124, 0.5962102],
		[0.6371818, 0.1158246, 0.6470448],
		[0.0063498, 0.2951452, 0.6623801]
	];
	const B = [
		[0, 0.5, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	const C = [
		[0.3185909, 0.0579123, 0.3235224],
		[0.0031749, 0.1475726, 0.33119005],
		[0.0000000, 0.0000000, 0.0000000]
	];
	const out = matlab.conv2(A, B, 'same');

	t.deepEqual(out, C);
	t.end();
});

test('should generate the convolution of "same" values like Matlab (conv2)', (t) => {
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
		[1.9677205305226, 2.7994413827229, 2.3686256720085],
		[2.1522248148631005, 1.9755068456836002, 1.7007216437643],
		[1.1623389165626001, 0.9970991503065001, 0.9203489336432]
	];
	const out = matlab.conv2(A, B, 'same');

	t.deepEqual(out, C);
	t.end();
});

test('should generate "full" convolution by default (conv2)', (t) => {
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
		[0.07896467241939999, 0.4476437328628, 1.0671798558974999, 1.4449986797848,
			1.1048727438869999, 0.3942785749416],
		[0.1580650409562, 0.9070254836025999, 1.8753006290867003, 2.1694107685774, 1.2405807528194,
			0.5724172550784],
		[0.3366206950002, 1.3329784243407001, 1.9677205305226, 2.7994413827229, 2.3686256720085,
			0.9935780074245999],
		[0.7801606209038, 1.2160740880295, 2.1522248148631005, 1.9755068456836002, 1.7007216437643,
			0.9012960118852],
		[0.5602410121344, 0.45634720605080004, 1.1623389165626001, 0.9970991503065001,
			0.9203489336432, 0.7772547949079],
		[0.0055434896964, 0.25934808651659996, 0.6569307463548001, 0.20307249377349998,
			0.20733443086349998, 0.342231926267]
	];

	const outSame = matlab.conv2(A, B, 'full');
	const out = matlab.conv2(A, B);

	t.deepEqual(out, C);
	t.deepEqual(out, outSame);
	t.end();
});

test('should generate the convolution of "valid" values (conv2)', (t) => {
	const A = [
		[0.4366211, 0.9054124, 0.5962102],
		[0.6371818, 0.1158246, 0.6470448],
		[0.0063498, 0.2951452, 0.6623801]
	];
	const B = [
		[0.909911, 0.824447, 0.880526],
		[0.970307, 0.867250, 0.097273],
		[0.075271, 0.940705, 0.281154]
	];
	const out = matlab.conv2(A, B, 'valid');

	t.equal(roundTo(out[0][0], 4), 2.6613);
	t.equal(out.length, 1);
	t.equal(out[0].length, 1);
	t.end();
});

test('should match Mattlab filter2 (filter2)', (t) => {
	const mx = [
		[1, 2, 3, 4],
		[5, 6, 7, 8],
		[9, 0, 1, 2],
		[3, 4, 5, 6]
	];
	const f = [
		[0, 1],
		[1, 0]
	];
	const C = [
		[0, 1, 2, 3, 4],
		[1, 7, 9, 11, 8],
		[5, 15, 7, 9, 2],
		[9, 3, 5, 7, 6],
		[3, 4, 5, 6, 0]
	];
	const filter = matlab.filter2(f, mx, 'full');

	t.deepEqual(filter, C);
	t.end();
});

test('filter2 should match conv2 for symmetric filters (filter2)', (t) => {
	const mx = [
		[1, 2, 3, 4],
		[5, 6, 7, 8],
		[9, 0, 1, 2],
		[3, 4, 5, 6]
	];
	const f = [
		[0, 1],
		[1, 0]
	];
	const filterF = matlab.filter2(f, mx, 'full');
	const convF = matlab.conv2(mx, f, 'full');

	const filterS = matlab.filter2(f, mx, 'same');
	const convS = matlab.conv2(mx, f, 'same');

	const filterV = matlab.filter2(f, mx, 'valid');
	const convV = matlab.conv2(mx, f, 'valid');

	t.deepEqual(filterF, convF);
	t.deepEqual(filterS, convS);
	t.deepEqual(filterV, convV);
	t.end();
});

test('should match Matlab symmetric, same imfilter (imfilter)', (t) => {
	const mx = [
		[1, 2, 3, 4],
		[5, 6, 7, 8],
		[9, 0, 1, 2],
		[3, 4, 5, 6]
	];
	const f = [
		[0, 1],
		[1, 0]
	];
	const C = [
		[2, 3, 5, 7],
		[6, 7, 9, 11],
		[14, 15, 7, 9],
		[12, 3, 5, 7]
	];
	const imfilter = matlab.imfilter(mx, f);

	t.deepEqual(imfilter, C);
	t.end();
});

test('should return a matrix of the same dimensions when resSize is "same" (imfilter)', (t) => {
	const mx1 = [
		[1, 2, 3, 4],
		[5, 6, 7, 8],
		[9, 0, 1, 2],
		[3, 4, 5, 6]
	];
	const mx2 = [
		[1, 2, 3],
		[5, 6, 7],
		[9, 0, 1],
		[3, 4, 5]
	];
	const mx3 = [
		[1, 2, 3],
		[5, 6, 7],
		[9, 0, 1]
	];
	const f = [
		[0, 1],
		[1, 0]
	];
	const imfilter1 = matlab.imfilter(mx1, f);
	const imfilter2 = matlab.imfilter(mx2, f);
	const imfilter3 = matlab.imfilter(mx3, f);

	t.equal(imfilter1.length, mx1.length);
	t.equal(imfilter1[0].length, mx1[0].length);
	t.equal(imfilter2.length, mx2.length);
	t.equal(imfilter2[0].length, mx2[0].length);
	t.equal(imfilter3.length, mx3.length);
	t.equal(imfilter3[0].length, mx3[0].length);

	t.end();
});
