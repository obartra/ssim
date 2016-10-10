const test = require('blue-tape');
const { filter2 } = require('../../../src/matlab/filter2');
const { conv2 } = require('../../../src/matlab/conv2');
const samples = require('../../helpers/imageSamples.json');
const { round } = require('../../helpers/round');

test('should rotate 180 and generate the convolution', (t) => {
	const out = filter2(samples['11x11'].window, samples['11x11'].gray, 'valid')
		.map(x => x.map(round));

	t.deepEqual(out, samples['11x11'].conv2);
	t.end();
});

test('should rotate180 images with different dimensions', (t) => {
	const out = filter2(samples['24x18'].window, samples['24x18'].gray, 'valid')
		.map(x => x.map(round));

	t.deepEqual(out, samples['24x18'].conv2);
	t.end();
});

test('should match Mattlab filter2', (t) => {
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
	const filter = filter2(f, mx, 'full');

	t.deepEqual(filter, C);
	t.end();
});

test('filter2 should match conv2 for symmetric filters', (t) => {
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
	const filterF = filter2(f, mx, 'full');
	const convF = conv2(mx, f, 'full');

	const filterS = filter2(f, mx, 'same');
	const convS = conv2(mx, f, 'same');

	const filterV = filter2(f, mx, 'valid');
	const convV = conv2(mx, f, 'valid');

	t.deepEqual(filterF, convF);
	t.deepEqual(filterS, convS);
	t.deepEqual(filterV, convV);
	t.end();
});
