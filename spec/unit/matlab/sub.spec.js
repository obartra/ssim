const test = require('blue-tape');
const { sub } = require('../../../src/matlab/sub');

const obj = {
	data: [
		11, 12, 13, 14,
		15, 16, 17, 18,
		19, 20, 21, 22,
		23, 24, 25, 26
	],
	width: 4,
	height: 4
};

test('should retrieve a subwindow from a matrix', (t) => {
	const { width, height, data } = sub(obj, 0, 1, 0, 1);

	t.equal(height, 1);
	t.equal(width, 1);
	t.deepEqual(data, [11]);
	t.end();
});

test('should retrieve a subwindow of any size with any offset', (t) => {
	const { width, height, data } = sub(obj, 0, 2, 2, 1);

	t.equal(height, 2);
	t.equal(width, 1);
	t.deepEqual(data, [19, 23]);
	t.end();
});
