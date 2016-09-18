const test = require('blue-tape');
const { ssim } = require('../src/ssim');
const options = require('../src/defaults.json');

test('should return 1 for equal data (ssim)', (t) => {
	const A = [2, 2, 2, 4, 40, 4, 100, 200, 9, 0];

	t.equal(ssim(A, A, options), 1);
	t.end();
});

