const test = require('blue-tape');
const { join } = require('path');
const Benchmark = require('benchmark');
const niv = require('npm-install-version');
const ssim = require('../../dist/ssim');

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
	function onComplete() {
		const fastest = this.filter('fastest').map('name');
		const slowest = this.filter('slowest').map('name');

		if (fastest.includes(method.FAST) && slowest.includes(method.SLOW)) {
			t.ok(`${method.FAST} is significantly faster than ${method.SLOW}`);
		} else {
			t.fail(`No statistical significance between ${method.FAST} and ${method.SLOW}`);
		}
		t.end();
	}

	function onError() {
		t.fail('Tests failed');
	}

	const suite = new Benchmark.Suite('SSIM algorithm', {
		async: true,
		defer: true,
		onError,
		onComplete
	});

	suite.add(method.FAST, {
		defer: true,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.FAST} failed`));
		}
	});

	suite.add(method.SLOW, {
		defer: true,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'original' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.SLOW} failed`));
		}
	});

	suite.run({
		defer: true,
		async: true
	});
});

test('ssim shouldn\'t be slower than the last published version of SSIM', (t) => {
	function onComplete() {
		const fastest = this.filter('fastest').map('name');

		if (fastest.includes(method.FAST)) {
			t.ok(`${method.FAST} is significantly faster than ${method.PRIOR}`);
		} else {
			t.fail(`performance of ${method.FAST} has regressed since last published SSIM version`);
		}
		t.end();
	}

	function onError() {
		t.fail('Tests failed');
	}

	const suite = new Benchmark.Suite('SSIM regression', {
		async: true,
		defer: true,
		onError,
		onComplete
	});

	suite.add(method.FAST, {
		defer: true,
		fn(deferred) {
			ssim(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.FAST} failed`));
		}
	});

	suite.add(method.PRIOR, {
		defer: true,
		fn(deferred) {
			oldSSIM(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
				.then(() => deferred.resolve())
				.catch(() => t.fail(`${method.PRIOR} failed`));
		}
	});

	suite.run({
		defer: true,
		async: true
	});
});
