const { resolve, sep } = require('path');
const { readdirSync } = require('fs');
const test = require('blue-tape');
const scores = require('./samples/IVC_color.json');
const ssim = require('../dist/ssim');
const { roundTo } = require('./helpers/round');

const path = resolve(__dirname, './samples/IVC_SubQualityDB/color');

function compare({ file, mssim, reference }, t) {
	return ssim(reference, file)
		.then(({ mssim: computedMssim }) => {
			t.equal(roundTo(computedMssim, 5), mssim);
		});
}

function filterbmpFiles(file = '') {
	return file.toLowerCase().endsWith('bmp');
}

function fileToObjectPath(fileName) {
	let referenceFile = fileName.split(sep).pop().split('_')[0];

	if (!referenceFile.endsWith('.bmp')) {
		referenceFile += '.bmp';
	}

	if (scores[fileName] === 0) {
		return {};
	}

	const reference = resolve(path, referenceFile);
	const file = resolve(path, fileName);

	return {
		[fileName]: {
			reference,
			file,
			mssim: scores[fileName] || 0
		}
	};
}

const bmps = Object.assign(...readdirSync(path)
	.filter(filterbmpFiles)
	.map(fileToObjectPath));

Object.keys(bmps).forEach((bmp) => {
	test(`should get a mssim of ${bmps[bmp].mssim} for ${bmp}`, t => compare(bmps[bmp], t));
});

