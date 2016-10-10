const test = require('blue-tape');
const { zeros } = require('../../../src/matlab/zeros');

test('should create a matrix of the specified size with all zeros', (t) => {
	t.deepEqual(zeros(4), [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]);
	t.end();
});
