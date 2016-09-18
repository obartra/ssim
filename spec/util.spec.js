const test = require('blue-tape');
const util = require('../src/util');

test('should return an array of length n (times)', (t) => {
	const arr = util.times(20);

	t.equal(arr.length, 20);
	t.end();
});

test('should contain the index as value (times)', (t) => {
	const arr = util.times(2);

	arr.forEach((value, index) => t.equal(value, index));
	t.end();
});

test('should repeat n times skipping steps (timesEvery)', (t) => {
	const arr = util.timesEvery(4, 2);
	const map = [0, 2];

	arr.forEach((value, index) => t.equal(value, map[index]));
	t.end();
});

test('should proceed at least once (timesEvery)', (t) => {
	const arr = util.timesEvery(40, 1000);
	const map = [0];

	arr.forEach((value, index) => t.equal(value, map[index]));
	t.end();
});
