const test = require('blue-tape');
const { version } = require('../version.js');

function runSharedTests(ssim, samples) {
	const promises = [];

	test('should be a function', (t) => {
		t.equal(typeof ssim, 'function');
		t.end();
	});

	test('should expose package version', (t) => {
		t.equal(ssim.version, version);
		t.end();
	});

	test('should expose additional ssim methods', (t) => {
		t.equal(typeof ssim.ssim, 'function');
		t.end();
	});

	test('Missing image parameters', (t) => {
		ssim()
			.then(() => t.fail('Should throw if missing both image parameters'))
			.catch(t.ok);
		ssim('path1')
			.then(() => t.fail('Should throw if missing first image parameters'))
			.catch(t.ok);
		ssim(undefined, 'path2')
			.then(() => t.fail('Should throw if missing second image parameters'))
			.catch(t.ok);
		t.end();
	});

	test('Invalid options', (t) => {
		ssim('1', '2', { apples: 3 })
			.then(() => t.fail('Should throw if passing invalid parameter'))
			.catch(t.ok);
		ssim('1', '2', { k1: -4 })
			.then(() => t.fail('Should throw if k1 is < 0'))
			.catch(t.ok);
		ssim('1', '2', { k2: -0.4 })
			.then(() => t.fail('Should throw if k2 is < 0'))
			.catch(t.ok);
		t.end();
	});

	test('Different dimensions', (t) => {
		const p = new Promise((resolve, reject) => {
			ssim(samples['3x3'], samples.lena)
				.then(() => t.fail('Should have failed promise for different size images'))
				.then(reject)
				.catch(() => {
					t.ok(true);
					resolve();
				});
		});

		promises.push(p);
		return p;
	});

	test('should produce a SSIM of 1 when compared with itself (3x3)', (t) => {
		const p = new Promise((resolve, reject) => {
			ssim(samples['3x3'], samples['3x3'], { windowSize: 3 })
				.then(({ mssim }) => t.equal(mssim, 1))
				.then(resolve)
				.catch(reject);
		});

		promises.push(p);
		return p;
	});

	return Promise.all(promises);
}

module.exports = runSharedTests;
