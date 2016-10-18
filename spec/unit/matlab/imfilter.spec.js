const test = require('blue-tape');
const { imfilter } = require('../../../src/matlab/imfilter');

test('should match Matlab symmetric, same imfilter', (t) => {
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

	t.deepEqual(imfilter(mx, f), C);
	t.end();
});

test('should return a matrix of the same dimensions when resSize is "same"', (t) => {
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
	const imfilter1 = imfilter(mx1, f);
	const imfilter2 = imfilter(mx2, f);
	const imfilter3 = imfilter(mx3, f);

	t.equal(imfilter1.length, mx1.length);
	t.equal(imfilter1[0].length, mx1[0].length);
	t.equal(imfilter2.length, mx2.length);
	t.equal(imfilter2[0].length, mx2[0].length);
	t.equal(imfilter3.length, mx3.length);
	t.equal(imfilter3[0].length, mx3[0].length);

	t.end();
});

test('should produce the same output when resSize is "same", "valid" and omitted', (t) => {
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

	t.deepEqual(imfilter(mx, f), C);
	t.deepEqual(imfilter(mx, f, 'symmetric'), C);
	t.deepEqual(imfilter(mx, f, 'symmetric', 'same'), C);
	t.deepEqual(imfilter(mx, f, 'symmetric', 'valid'), C);
	t.end();
});

test('should produce different resSize is "same" from when it is "full"', (t) => {
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

	t.deepEqual(imfilter(mx, f, 'symmetric', 'same'), C);
	t.notDeepEqual(imfilter(mx, f, 'symmetric', 'full'), imfilter(mx, f, 'symmetric', 'same'));
	t.end();
});
