const test = require('blue-tape');
const math = require('../src/math');

test('should get the average between 2 numbers (average)', (t) => {
	const avg = math.average([2, 4]);

	t.equal(avg, 3);
	t.end();
});

test('should round to the lowest integer each element of the array (floor)', (t) => {
	const floor = math.floor([1.1, 1.9, 1, -1.5, -1.9, -1.1]);

	t.deepEqual(floor, [1, 1, 1, -2, -2, -2]);
	t.end();
});

test('should add all the values in the matrix (sum2d)', (t) => {
	const sum = math.sum2d([[1, 1, 2]]);
	const sum2 = math.sum2d([[1, 1, 2], [0, 0, -1]]);

	t.equal(sum, 4);
	t.equal(sum2, 3);
	t.end();
});

test('should add a constant value to each matrix element (add2d)', (t) => {
	const add = math.add2d([[1, 2], [3, 4]], 10);

	t.deepEqual(add, [[11, 12], [13, 14]]);
	t.end();
});

test('should add 2 matrices of the same size (add2d)', (t) => {
	const add = math.add2d([[1, 2], [3, 4]], [[-1, -2], [-3, -4]]);

	t.deepEqual(add, [[0, 0], [0, 0]]);
	t.end();
});

test('should divide by a constant value each matrix element (divide2d)', (t) => {
	const divide = math.divide2d([[10, 20], [30, 40]], 10);

	t.deepEqual(divide, [[1, 2], [3, 4]]);
	t.end();
});

test('should divide 2 matrices of the same size (divide2d)', (t) => {
	const divide = math.divide2d([[10, 20], [30, 40]], [[1, 2], [3, 4]]);

	t.deepEqual(divide, [[10, 10], [10, 10]]);
	t.end();
});

test('should multiply by a constant value each matrix element (multiply2d)', (t) => {
	const multiply = math.multiply2d([[10, 20], [30, 40]], 10);

	t.deepEqual(multiply, [[100, 200], [300, 400]]);
	t.end();
});

test('should multiply 2 matrices of the same size (multiply2d)', (t) => {
	const multiply = math.multiply2d([[10, 20], [30, 40]], [[1, 2], [3, 4]]);

	t.deepEqual(multiply, [[10, 40], [90, 160]]);
	t.end();
});

test('should compute the square value for each matrix element (square2d)', (t) => {
	const square = math.square2d([[1, 2], [3, 4]]);

	t.deepEqual(square, [[1, 4], [9, 16]]);
	t.end();
});

test('should compute the mean of all matrix elements (mean2d)', (t) => {
	const mean = math.mean2d([[2, 2], [3, 3]]);
	const mean2 = math.mean2d([[1, 1], [1, 1]]);
	const mean3 = math.mean2d([[1.52, 12.3], [76, -1]]);

	t.equal(mean, 2.5);
	t.equal(mean2, 1);
	t.equal(mean3, 22.205);
	t.end();
});
