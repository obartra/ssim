const { readFileSync } = require('fs');
const { join } = require('path');
const { readpixels } = require('../../src/readpixels');
const { imageDataToMx } = require('./util');

const testPath = join(__dirname, '../');

function toMx(txt) {
	return txt
		.toString()
		.trim()
		.split('\n')
		.map(line =>
			line
				.split(',')
				.map(val => parseInt(val || 0, 10))
		);
}

function loadImages(samples) {
	const promises = Object.keys(samples)
		.map(key =>
			readpixels(join(testPath, samples[key]))
				.then(pixels => ({ [key]: imageDataToMx(pixels) })
			)
		);

	return Promise.all(promises).then(values => Object.assign(...values));
}

function loadCsv(samples) {
	const csvs = Object.keys(samples).map(key => ({
		[key]: toMx(readFileSync(join(testPath, samples[key])))
	}));

	return Object.assign(...csvs);
}

module.exports = {
	loadImages,
	loadCsv
};
