const test = require('blue-tape');
const index = require('../index');
const { ssim } = require('../index');
const { roundTo } = require('./helpers/round');
const { join } = require('path');
const { version } = require('../package.json');

const samples = {
	'3x3': join(__dirname, './samples/3x3.jpg'),
	e1: join(__dirname, './samples/einstein/Q1.gif'),
	e0913: join(__dirname, './samples/einstein/Q0913.gif'),
	e0988: join(__dirname, './samples/einstein/Q0988.gif'),
	lena1: join(__dirname, './samples/lena/Q1.gif'),
	lena02876: join(__dirname, './samples/lena/Q02876.gif'),
	lena03461: join(__dirname, './samples/lena/Q03461.gif'),
	lena03891: join(__dirname, './samples/lena/Q03891.gif'),
	lena04408: join(__dirname, './samples/lena/Q04408.gif'),
	lena06494: join(__dirname, './samples/lena/Q06494.gif'),
	lena09372: join(__dirname, './samples/lena/Q09372.gif'),
	lena09894: join(__dirname, './samples/lena/Q09894.gif'),
	barba1: join(__dirname, './samples/IVC/barba/barba.bmp'),
	barbaj2kr1: join(__dirname, './samples/IVC/barba/barba_j2000_r1.bmp'),
	barbaj2kr2: join(__dirname, './samples/IVC/barba/barba_j2000_r2.bmp'),
	barbaj2kr3: join(__dirname, './samples/IVC/barba/barba_j2000_r3.bmp'),
	barbaj2kr4: join(__dirname, './samples/IVC/barba/barba_j2000_r4.bmp'),
	barbaj2kr5: join(__dirname, './samples/IVC/barba/barba_j2000_r5.bmp')
};

test('should be a function', (t) => {
	t.equal(typeof index, 'function');
	t.end();
});

test('should be able to destructure params from function', (t) => {
	t.equal(typeof ssim, 'function');
	t.end();
});

test('should expose package version', (t) => {
	t.equal(index.version, version);
	t.end();
});

test('should expose additional ssim methods', (t) => {
	t.equal(typeof index.ssim, 'function');
	t.end();
});

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

test('should produce a SSIM of 1 when compared with itself (3x3)', t =>
	index(samples['3x3'], samples['3x3'], { windowSize: 3 }).then(({ mssim }) => t.equal(mssim, 1))
);

test('should produce a SSIM of 1 when compared with itself (lena)', t =>
	index(samples.lena1, samples.lena1).then(({ mssim }) => t.equal(mssim, 1))
);

test('should produce a SSIM of 0.2876 (lena)', t =>
	index(samples.lena1, samples.lena02876).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.76269))
);

test('should produce a SSIM of 0.3461 (lena)', t =>
	index(samples.lena1, samples.lena03461).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.75429))
);

test('should produce a SSIM of 0.3891 (lena)', t =>
	index(samples.lena1, samples.lena03891).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.77107))
);

test('should produce a SSIM of 0.4408 (lena)', t =>
	index(samples.lena1, samples.lena04408).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.77647))
);

test('should produce a SSIM of 0.6494 (lena)', t =>
	index(samples.lena1, samples.lena06494).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.80795))
);

test('should produce a SSIM of 0.9372 (lena)', t =>
	index(samples.lena1, samples.lena09372).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.95390))
);

test('should produce a SSIM of 0.9894 (lena)', t =>
	index(samples.lena1, samples.lena09894).then(({ mssim }) => t.equal(roundTo(mssim, 5), 0.98972))
);
