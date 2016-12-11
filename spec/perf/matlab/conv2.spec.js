const test = require('blue-tape');
const Benchmark = require('benchmark');
const { conv2 } = require('../../../src/matlab/conv2');

const A = {
	data: [
		10, 20, 30, 10, 20, 30, 10, 20, 30,
		40, 50, 60, 40, 50, 60, 40, 50, 60,
		70, 80, 90, 70, 80, 90, 70, 80, 90,
		10, 20, 30, 10, 20, 30, 10, 20, 30,
		40, 50, 60, 40, 50, 60, 40, 50, 60,
		70, 80, 90, 70, 80, 90, 70, 80, 90,
		10, 20, 30, 10, 20, 30, 10, 20, 30,
		40, 50, 60, 40, 50, 60, 40, 50, 60,
		70, 80, 90, 70, 80, 90, 70, 80, 90
	],
	width: 9,
	height: 9
};
const box = {
	data: [
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9
	],
	width: 9,
	height: 9
};
const nonBox = {
	data: [
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9,
		1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 8, 1 / 9, 1 / 9, 1 / 9, 1 / 9
	],
	width: 9,
	height: 9
};
const KERNEL = {
	BOX: 'Box kernel',
	NONBOX: 'Non box kernel'
};

test('box kernels should perform better than non box kernels', (t) => {
	function onComplete() {
		const fastest = this.filter('fastest').map('name');
		const slowest = this.filter('slowest').map('name');

		if (fastest.includes(KERNEL.BOX) && slowest.includes(KERNEL.NONBOX)) {
			t.ok(`${KERNEL.BOX} is significantly faster than ${KERNEL.NONBOX}`);
		} else {
			t.fail(`No statistical significance between ${KERNEL.BOX} and ${KERNEL.NONBOX}`);
		}
		t.end();
	}

	function onError() {
		t.fail('Tests failed');
	}

	const suite = new Benchmark.Suite('Convolution kernel comparison', {
		onError,
		onComplete
	});

	suite.add(KERNEL.BOX, () => conv2(A, box, 'full'));
	suite.add(KERNEL.NONBOX, () => conv2(A, nonBox, 'full'));
	suite.run();
});
