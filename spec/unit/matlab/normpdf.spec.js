const test = require('blue-tape');
const { normpdf } = require('../../../src/matlab/normpdf');
const { get } = require('../../helpers/round');

test('should match matlab results', (t) => {
	const A = {
		data: [2, 1, 0, 1, 2],
		width: 5,
		height: 1
	};
	const µ = 0;
	const σ = 1.5;
	const expected = {
		data: [0.10934, 0.21297, 0.26596, 0.21297, 0.10934],
		width: 5,
		height: 1
	};
	const out = normpdf(A, µ, σ);

	for (let i = 0; i < out.height; i++) {
		for (let j = 0; j < out.width; j++) {
			t.equal(get(out, i, j), get(expected, i, j));
		}
	}
	t.end();
});

test('should default to a length of 0 and sigma of 1', (t) => {
	const A = {
		data: [2, 1, 0, 1, 2],
		width: 5,
		height: 1
	};
	const out = normpdf(A, 0, 1);
	const outDefault = normpdf(A);

	t.deepEqual(out, outDefault);
	t.end();
});
