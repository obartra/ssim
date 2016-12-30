const test = require('blue-tape');
const { join } = require('path');
const niv = require('npm-install-version');
const ssim = require('../../dist/ssim');
const measure = require('../helpers/measure');

niv.install('ssim.js@latest');

const oldSSIM = niv.require('ssim.js@latest');

const samples = {
	avion: join(__dirname, '../samples/IVC_SubQualityDB/color/avion.bmp'),
	avion_j2000_r1: join(__dirname, '../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp')
};

const method = {
	FAST: 'Fast SSIM',
	SLOW: 'Original SSIM',
	PRIOR: 'Last published SSIM version'
};

test('ssim should be faster than originalSsim', (t) => {
	measure(t, 'SSIM algorithm', true, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.FAST} failed`));
		}
	}, {
		name: method.SLOW,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'original' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.SLOW} failed`));
		}
	});
});

test('ssim shouldn\'t be slower than the last published version of SSIM', (t) => {
	measure(t, 'SSIM regression', true, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.FAST} failed`));
		}
	}, {
		name: method.PRIOR,
		fn(deferred) {
			oldSSIM(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.PRIOR} failed`));
		}
	});
});
