const test = require('blue-tape');
const { imfilter, dimfilter } = require('../../../src/matlab/imfilter');

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

test('should match results between a filter and its decomposed counterparts', (t) => {
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
			1, 1,
			1, 1
		],
		width: 2,
		height: 2
	};
	// since:
	//   rank(f) === 1
	// then:
	//   [U, S, V] = svd(f)
	//   v = U(:,1) * sqrt(S(1,1))
	//   h = V(:,1)' * sqrt(S(1,1))
	const v = { data: [-1, -1], width: 1, height: 2 };
	const h = { data: [-1, -1], width: 2, height: 1 };

	const out = imfilter(mx, f, 'symmetric', 'same');
	const vhOut = dimfilter(mx, v, h, 'symmetric', 'same');

	t.deepEqual(out, vhOut);
	t.end();
});

test('dimfilter should default to symmetric padding and resize size of "same"', (t) => {
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
	const v = { data: [-1, -1], width: 1, height: 2 };
	const h = { data: [-1, -1], width: 2, height: 1 };

	const outDefault = dimfilter(mx, v, h);
	const out = dimfilter(mx, v, h, 'symmetric', 'same');

	t.deepEqual(out, outDefault);
	t.end();
});
