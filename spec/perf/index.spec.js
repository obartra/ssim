const test = require('blue-tape');
const { join } = require('path');
const niv = require('npm-install-version');
const ssim = require('../../dist/ssim');
const measure = require('../helpers/measure');

niv.install('ssim.js@latest');

const oldSSIM = niv.require('ssim.js@latest');

const samples = {
	avion: join(__dirname, '../samples/IVC_SubQualityDB/color/avion.bmp'),
	avion_j2000_r1: join(__dirname, '../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp'),
	large: join(__dirname, '../samples/aspectratio/1.jpg'),
	large_high: join(__dirname, '../samples/aspectratio/1_high.jpg')
};

const method = {
	BEZKROVNY: 'Bezkrovny SSIM',
	FAST: 'Fast SSIM',
	PRIOR: 'Last published SSIM version',
	SLOW: 'Original SSIM'
};

function onError(methodName, t) {
	return () => {
		t.fail(`${methodName} failed`);
		t.end();
	};
}

test('ssim should be faster than originalSsim', (t) => {
	measure(t, 'SSIM algorithm', true, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.FAST, t));
		}
	}, {
		name: method.SLOW,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'original' })
				.then(() => deferred.resolve())
				.catch(onError(method.SLOW, t));
		}
	});
});

test('bezkrovny ssim should be faster than ssim', (t) => {
	measure(t, 'SSIM algorithm', true, {
		name: method.BEZKROVNY,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'bezkrovny' })
				.then(() => deferred.resolve())
				.catch(onError(method.BEZKROVNY, t));
		}
	}, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.FAST, t));
		}
	});
});

test('ssim shouldn\'t be slower than the last published version of SSIM  for small images', (t) => {
	measure(t, 'SSIM regression', true, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.FAST, t));
		}
	}, {
		name: method.PRIOR,
		fn(deferred) {
			oldSSIM(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.PRIOR, t));
		}
	});
});

test('ssim shouldn\'t be slower than the last published version of SSIM for large images', (t) => {
	measure(t, 'large image SSIM regression', true, {
		name: method.FAST,
		fn(deferred) {
			ssim(samples.large, samples.large_high, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.FAST, t));
		}
	}, {
		name: method.PRIOR,
		fn(deferred) {
			oldSSIM(samples.large, samples.large_high, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(onError(method.PRIOR, t));
		}
	});
});
