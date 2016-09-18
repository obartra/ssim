const test = require('blue-tape');
const math = require('../src/math');

test('should get the average between 2 numbers (average)', (t) => {
	const avg = math.average([2, 4]);

	t.equal(avg, 3);
	t.end();
});

test('should get the variance between 2 numbers (variance)', (t) => {
	const variance = math.variance([0, 2]);

	t.equal(variance, 1);
	t.end();
});

test('adding a constant value to variance should not change its value (variance)', (t) => {
	const variance = math.variance([1, 2, 3]);
	const varianceAdd4 = math.variance([1 + 4, 2 + 4, 3 + 4]);

	t.equal(variance, varianceAdd4);
	t.end();
});

test('multiply by a constant should increase the variance by the square of the constant (variance)',
(t) => {
	const constant = 5;
	const variance = math.variance([5, 6, 70, 9]);
	const varianceTimes5 = math.variance([5 * constant, 6 * constant, 70 * constant, 9 * constant]);

	t.equal(variance * Math.pow(5, 2), varianceTimes5);
	t.end();
});

test('variance should be 0 for constants (variance)', (t) => {
	const variance = math.variance([3]);

	t.equal(variance, 0);
	t.end();
});

test('covariance of two constants should be 0 (covariance)', (t) => {
	const covariance = math.covariance([2], [4]);

	t.equal(covariance, 0);
	t.end();
});

test('covariance should be combinative (covariance)', (t) => {
	const A = [1, 6, 100];
	const B = [89, 19, 43];
	const covariance = math.covariance(A, B);
	const combinedCovariance = math.covariance(B, A);

	t.equal(covariance, combinedCovariance);
	t.end();
});

test('should get the covariance of two arrays (covariance)', (t) => {
	const A = [1, 3, 2, 5, 8, 7, 12, 2, 4];
	const B = [8, 6, 9, 4, 3, 3, 2, 7, 7];
	const covariance = math.covariance(A, B);

	t.equal(covariance.toFixed(4), '-7.1728');
	t.end();
});
