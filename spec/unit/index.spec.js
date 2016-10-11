const test = require('blue-tape');
const { join, resolve } = require('path');
const index = require('../../index');
const { ssim } = require('../../index');
const { roundTo } = require('../helpers/round');
const { version } = require('../../package.json');
const getJSONScores = require('../helpers/getJSONScores');
const arScores = require('../samples/aspectratio.json');
const lenaScores = require('../samples/lena.json');

const samples = {
	'3x3': join(__dirname, '../samples/3x3.jpg'),
	lena: join(__dirname, '../samples/lena/Q.gif'),
	avion: join(__dirname, '../samples/IVC_SubQualityDB/color/avion.bmp'),
	avion_j2000_r1: join(__dirname, '../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp')
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
	index(samples['3x3'], samples.lena)
		.then(() => t.fail('Should have failed promise for different size images'))
		.catch(t.ok)
);

test('should produce a SSIM of 1 when compared with itself (3x3)', t =>
	index(samples['3x3'], samples['3x3'], { windowSize: 3 }).then(({ mssim }) => t.equal(mssim, 1))
);

test('should produce the right SSIM for bmp images as well (avion)', t =>
	index(samples.avion, samples.avion_j2000_r1).then(({ mssim }) =>
		t.equal(roundTo(mssim, 5), 0.97880))
);

test('downsizing should produce comparable results between "fast" and "original"', t =>
	Promise.all([
		index(samples.avion, samples.avion_j2000_r1, { downsample: 'fast' }),
		index(samples.avion, samples.avion_j2000_r1, { downsample: 'original' })
	]).then(([{ mssim: fastMssim }, { mssim: origMssim }]) =>
		t.equal(Math.abs(fastMssim - origMssim) < 0.05, true, 'Differences should be < 5%')
	)
);

test('downsizing should be faster than not downsizing', t =>
	Promise.all([
		index(samples.avion, samples.avion_j2000_r1, { downsample: 'fast' }),
		index(samples.avion, samples.avion_j2000_r1, { downsample: false })
	]).then(([{ performance: origPerf }, { performance: noPerf }]) =>
		t.equal(origPerf < noPerf, true, 'No point in downsizing if it is faster not doing it')
	)
);

function compare({ file, mssim, reference }, t) {
	return index(reference, file)
		.then(({ mssim: computedMssim }) => {
			t.equal(roundTo(computedMssim, 5), mssim);
		});
}

const lena = getJSONScores(lenaScores, resolve(__dirname, '../samples/lena'), 'gif');

Object.keys(lena).forEach((key) => {
	test(`should get a mssim of ${lena[key].mssim} for ${key}`, t => compare(lena[key], t));
});

const ar = getJSONScores(arScores, resolve(__dirname, '../samples/aspectratio'), 'jpg');

Object.keys(ar).forEach((key) => {
	test(`should get a mssim of ${ar[key].mssim} for ${key}`, t => compare(ar[key], t));
});
