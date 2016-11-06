const test = require('blue-tape');
const { transpose } = require('../../../src/matlab/transpose');
const { ones } = require('../../../src/matlab/ones');

test('should transpose a vector', (t) => {
	t.deepEqual(transpose(ones(1, 4)), { data: [1, 1, 1, 1], width: 1, height: 4 });
	t.end();
});

test('should transpose a vertical vector into a matrix', (t) => {
	t.deepEqual(transpose(ones(4, 1)), { data: [1, 1, 1, 1], width: 4, height: 1 });
	t.end();
});

test('should transpose a matrix', (t) => {
	t.deepEqual(transpose({
		data: [
			1, 2, 3,
			4, 5, 6
		],
		width: 3,
		height: 2
	}), {
		data: [
			1, 4,
			2, 5,
			3, 6
		],
		width: 2,
		height: 3
	});
	t.end();
});
