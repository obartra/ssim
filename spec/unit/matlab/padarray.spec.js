const test = require('blue-tape');
const { padarray } = require('../../../src/matlab/padarray');

test('should be able to add padding greater than the matrix dimensions', (t) => {
	const A = [[1, 2], [3, 4]];
	const out = padarray(A, [3, 3]);
	const expected = [
		[4, 4, 3, 3, 4, 4, 3, 3],
		[4, 4, 3, 3, 4, 4, 3, 3],
		[2, 2, 1, 1, 2, 2, 1, 1],
		[2, 2, 1, 1, 2, 2, 1, 1],
		[4, 4, 3, 3, 4, 4, 3, 3],
		[4, 4, 3, 3, 4, 4, 3, 3],
		[2, 2, 1, 1, 2, 2, 1, 1],
		[2, 2, 1, 1, 2, 2, 1, 1]
	];

	t.deepEqual(out, expected);
	t.end();
});

test('should mirror a matrix multiple times if needed', (t) => {
	const A = [[1, 2, 3], [4, 5, 6]];
	const out = padarray(A, [0, 5]);
	const expected = [
		[2, 3, 3, 2, 1, 1, 2, 3, 3, 2, 1, 1, 2],
		[5, 6, 6, 5, 4, 4, 5, 6, 6, 5, 4, 4, 5]
	];

	t.deepEqual(out, expected);
	t.end();
});

test('should mirror fractions of a full matrix', (t) => {
	const A = [[1, 2, 3], [4, 5, 6]];
	const out = padarray(A, [1, 0]);
	const expected = [
		[1, 2, 3],
		[1, 2, 3],
		[4, 5, 6],
		[4, 5, 6]
	];

	t.deepEqual(out, expected);
	t.end();
});
