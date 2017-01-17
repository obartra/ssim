const test = require('blue-tape');
const { imfilter } = require('../../../src/matlab/imfilter');

test('should match Matlab symmetric, same imfilter', (t) => {
	const A = {
		data: [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 0, 1, 2,
			3, 4, 5, 6
		],
		width: 4,
		height: 4
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};
	const C = {
		data: [
			2, 3, 5, 7,
			6, 7, 9, 11,
			14, 15, 7, 9,
			12, 3, 5, 7
		],
		width: 4,
		height: 4
	};

	t.deepEqual(imfilter(A, f), C);
	t.end();
});

test('should return a matrix of the same dimensions when resSize is "same"', (t) => {
	const A = {
		data: [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 0, 1, 2,
			3, 4, 5, 6
		],
		width: 4,
		height: 4
	};
	const B = {
		data: [
			1, 2, 3,
			5, 6, 7,
			9, 0, 1,
			3, 4, 5
		],
		width: 3,
		height: 4
	};
	const C = {
		data: [
			1, 2, 3,
			5, 6, 7,
			9, 0, 1
		],
		width: 3,
		height: 3
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};

	const imfilter1 = imfilter(A, f);
	const imfilter2 = imfilter(B, f);
	const imfilter3 = imfilter(C, f);

	t.equal(imfilter1.height, A.height);
	t.equal(imfilter1.width, A.width);
	t.equal(imfilter2.height, B.height);
	t.equal(imfilter2.width, B.width);
	t.equal(imfilter3.height, C.height);
	t.equal(imfilter3.width, C.width);

	t.end();
});

test('should produce the same output when resSize is "same", "valid" and omitted', (t) => {
	const mx = {
		data: [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 0, 1, 2,
			3, 4, 5, 6
		],
		width: 4,
		height: 4
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};
	const C = {
		data: [
			2, 3, 5, 7,
			6, 7, 9, 11,
			14, 15, 7, 9,
			12, 3, 5, 7
		],
		width: 4,
		height: 4
	};

	t.deepEqual(imfilter(mx, f), C);
	t.deepEqual(imfilter(mx, f, 'symmetric'), C);
	t.deepEqual(imfilter(mx, f, 'symmetric', 'same'), C);
	t.deepEqual(imfilter(mx, f, 'symmetric', 'valid'), C);
	t.end();
});

test('should produce different resSize is "same" from when it is "full"', (t) => {
	const A = {
		data: [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 0, 1, 2,
			3, 4, 5, 6
		],
		width: 4,
		height: 4
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};
	const C = {
		data: [
			2, 3, 5, 7,
			6, 7, 9, 11,
			14, 15, 7, 9,
			12, 3, 5, 7
		],
		width: 4,
		height: 4
	};

	t.deepEqual(imfilter(A, f, 'symmetric', 'same'), C);
	t.notDeepEqual(imfilter(A, f, 'symmetric', 'full'), imfilter(A, f, 'symmetric', 'same'));
	t.end();
});

test('should not remove the last row when the number of rows is odd', (t) => {
	const A = {
		data: [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 0, 1, 2
		],
		width: 4,
		height: 3
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};

	t.equal(imfilter(A, f).height, 3);
	t.end();
});

test('should not remove the last column when the number of columns is odd', (t) => {
	const A = {
		data: [
			1, 2, 3,
			5, 6, 7,
			9, 0, 1,
			12, 3, 5
		],
		width: 3,
		height: 4
	};
	const f = {
		data: [
			0, 1,
			1, 0
		],
		width: 2,
		height: 2
	};

	t.equal(imfilter(A, f).width, 3);
	t.end();
});
