const test = require('blue-tape');
const { transpose } = require('../../../src/matlab/transpose');
const { ones } = require('../../../src/matlab/ones');

test('should transpose a vector', (t) => {
	t.deepEqual(transpose(ones(1, 4)), [
		[1],
		[1],
		[1],
		[1]
	]);
	t.end();
});

test('should transpose a vertical vector into a matrix', (t) => {
	t.deepEqual(transpose(ones(4, 1)), [[1, 1, 1, 1]]);
	t.end();
});

test('should transpose a matrix', (t) => {
	t.deepEqual(transpose([
		[1, 2, 3],
		[4, 5, 6]
	]), [
		[1, 4],
		[2, 5],
		[3, 6]
	]);
	t.end();
});
