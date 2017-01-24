const options = require('../../src/defaults.json');
const { downsample } = require('../../src/downsample');
const test = require('blue-tape');
const samples = require('../helpers/imageSamples.json');

test('should not honor max size parameter if it is more than half the size', (t) => {
	const A = { data: samples['24x18'].gray, width: 24, height: 18 };
	const B = { data: samples['24x18-degraded'].gray, width: 24, height: 18 };
	const limMaxSize = Object.assign({}, options, {
		downsample: 'original',
		maxSize: 13
	});

	const resized = downsample([A, B], limMaxSize);

	t.equal(resized[0].width, 24);
	t.equal(resized[0].height, 18);
	t.equal(resized[1].width, 24);
	t.equal(resized[1].height, 18);
	t.equal(resized.length, 2);
	t.end();
});

test('should honor max size parameter if it is at least half the size', (t) => {
	const A = { data: samples['24x18'].gray, width: 24, height: 18 };
	const B = { data: samples['24x18-degraded'].gray, width: 24, height: 18 };
	const limMaxSize = Object.assign({}, options, {
		downsample: 'original',
		maxSize: 12
	});

	const resized = downsample([A, B], limMaxSize);

	t.equal(resized[0].width, 12);
	t.equal(resized[0].height, 9);
	t.equal(resized[1].width, 12);
	t.equal(resized[1].height, 9);
	t.equal(resized.length, 2);
	t.end();
});

test('should default max size parameter to 256', (t) => {
	const A = { data: samples['24x18'].gray, width: 24, height: 18 };
	const B = { data: samples['24x18-degraded'].gray, width: 24, height: 18 };
	const limMaxSize = Object.assign({}, options, {
		downsample: 'original',
		maxSize: undefined
	});
	const resized = downsample([A, B], limMaxSize);

	t.equal(resized[0].width, 24);
	t.equal(resized[0].height, 18);
	t.equal(resized[1].width, 24);
	t.equal(resized[1].height, 18);
	t.equal(resized.length, 2);
	t.end();
});
