const test = require('blue-tape');
const math = require('../src/math');

test('should get the average between 2 numbers (average)', (t) => {
	const avg = math.average([2, 4]);

	t.equal(avg, 3);
	t.end();
});

