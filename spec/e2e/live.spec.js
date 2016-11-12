require('core-js/es6/promise');
require('core-js/modules/es6.object.keys');

const { resolve } = require('path');
const test = require('blue-tape');
const ssim = require('../../dist/ssim');
const { roundTo } = require('../helpers_dist/round');
const scores = require('../samples/LIVE.json');

const tol = 10 ** -5; // 0.00001, to account for rounding differences on the 6th decimal
const base = 'spec/samples/LIVE';

function createTest({ file, reference, mssim, type }) {
	test(`should get a mssim of ${mssim} for ${file}/${reference} (${type})`, (t) => {
		const refPath = resolve(base, 'refimgs', reference);
		const filePath = resolve(base, type, file);

		return ssim(refPath, filePath).then(({ mssim: computedMssim }) => {
			const fcomputed = roundTo(computedMssim, 5);
			const freference = roundTo(parseFloat(mssim), 5);
			const diff = roundTo(Math.abs(fcomputed - freference), 5);

			return t.equal(diff - tol <= 0, true, `expected ${fcomputed}, got ${freference} (${diff}/${tol})`);
		});
	});
}

scores.forEach(createTest);
