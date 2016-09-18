const test = require('blue-tape');
const index = require('../index');
const { join } = require('path');

const samples = {
	'3x3': join(__dirname, './samples/3x3.jpg'),
	e1: join(__dirname, './samples/einstein1.gif'),
	e0913: join(__dirname, './samples/einstein0913.gif'),
	e0988: join(__dirname, './samples/einstein0988.gif')
};

test('Missing image parameters', (t) => {
	t.throws(() => index(), 'Should throw if missing both image parameters');
	t.throws(() => index('path1'), 'Should throw if missing first image parameters');
	t.throws(() => index(undefined, 'path2'), 'Should throw if missing second image parameters');
	t.end();
});

test('Invalid options', (t) => {
	t.throws(() => index('1', '2', { apples: 3 }), 'Should throw if passing invalid parameter');
	t.throws(() => index('1', '2', { k1: -4 }), 'Should throw if k1 is < 0');
	t.throws(() => index('1', '2', { k2: -0.4 }), 'Should throw if k2 is < 0');
	t.end();
});

test('Different dimensions', t =>
	index(samples['3x3'], samples.e1)
		.then(() => t.fail('Should have failed promise for different size images'))
		.catch(t.ok)
);

test('should produce a SSIM of one when compared with itself', t =>
	index(samples['3x3'], samples['3x3']).then(ssim => t.equal(ssim, 1))
);

// test('should correctly compute a SSIM of 0.913 for einstein0913 reference image', t =>
// 	index(samples.e1, samples.e0913).then(ssim => t.equal(ssim, 0.913))
// );
