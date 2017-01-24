const arScores = require('../samples/aspectratio.json');
const getJSONScores = require('../helpers/getJSONScores');
const index = require('../../index');
const lenaScores = require('../samples/lena.json');
const runSharedTests = require('../shared');
const test = require('blue-tape');
const { join, resolve } = require('path');
const { roundTo } = require('../helpers/round');
const { ssim } = require('../../index');

const samples = {
	'3x3': join(__dirname, '../samples/3x3.jpg'),
	lena: join(__dirname, '../samples/lena/Q.gif'),
	avion: join(__dirname, '../samples/IVC_SubQualityDB/color/avion.bmp'),
	avion_j2000_r1: join(__dirname, '../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp')
};

runSharedTests(index, samples);

test('should be able to destructure params from function', (t) => {
	t.equal(typeof ssim, 'function');
	t.end();
});

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

test('ssim should produce the same output than originalSsim', t =>
	index(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
	.then(({ mssim: fast }) => {
		index(samples.avion, samples.avion_j2000_r1, { ssim: 'original' })
		.then(({ mssim: original }) => {
			t.equal(roundTo(fast, 5), roundTo(original, 5), 'SSIM should produce the same results');
		})
		.catch(t.fail);
	})
);

test('should fail if an invalid ssim value is specified', t =>
	index(samples.avion, samples.avion_j2000_r1, { ssim: 'invalid' })
		.then(t.fail)
		.catch(t.ok)
);

function compare({ file, mssim, reference }, t) {
	return index(reference, file)
		.then(({ mssim: computedMssim }) => {
			t.equal(roundTo(computedMssim, 5), mssim);
		})
		.catch(t.fail);
}

const lena = getJSONScores(lenaScores, resolve(__dirname, '../samples/lena'), 'gif');

Object.keys(lena).forEach((key) => {
	test(`should get a mssim of ${lena[key].mssim} for ${key}`, t => compare(lena[key], t));
});

const ar = getJSONScores(arScores, resolve(__dirname, '../samples/aspectratio'), 'jpg');

Object.keys(ar).forEach((key) => {
	test(`should get a mssim of ${ar[key].mssim} for ${key}`, t => compare(ar[key], t));
});

test('should downsample images and produce somewhat similar results', (t) => {
	const ssimMap = index(samples.avion, samples.avion_j2000_r1);
	const fullSsimMap = index(samples.avion, samples.avion_j2000_r1, {
		downsample: false
	});

	Promise.all([ssimMap, fullSsimMap]).then(([ssimResults, fullSsimResults]) => {
		const difference = Math.abs(ssimResults.mssim - fullSsimResults.mssim);

		t.equal(difference < 0.1, true, 'Difference is greater than 10%');
		t.end();
	})
	.catch(t.fail);
});
