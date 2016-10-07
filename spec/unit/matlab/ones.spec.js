const test = require('blue-tape');
const { ones } = require('../../../src/matlab/ones');

test('should create a matrix of the specified size with all ones', (t) => {
	t.deepEqual(ones(4), [
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[1, 1, 1, 1]
	]);
	t.end();
});
