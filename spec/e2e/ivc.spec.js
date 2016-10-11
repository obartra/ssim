const { resolve } = require('path');
const test = require('blue-tape');
const scores = require('../samples/IVC_color.json');
const ssim = require('../../dist/ssim');
const { roundTo } = require('../helpers_dist/round');
const getJSONScores = require('../helpers_dist/getJSONScores');

const path = resolve(__dirname, '../samples/IVC_SubQualityDB/color');

function compare({ file, mssim, reference }, t) {
	return ssim(reference, file)
		.then(({ mssim: computedMssim }) => {
			t.equal(roundTo(computedMssim, 5), mssim);
		});
}

const bmps = getJSONScores(scores, path, 'bmp');

Object.keys(bmps).forEach((bmp) => {
	test(`should get a mssim of ${bmps[bmp].mssim} for ${bmp}`, t => compare(bmps[bmp], t));
});

