/* eslint-disable no-console */
const window = require('./src/window');
const { readpixels } = require('./src/readpixels');
const { getLumaPixel, hasSameDimensions } = require('./src/image');
const { average } = require('./src/math');
const { ssim } = require('./src/ssim');
const { force } = require('./src/util');
const defaults = require('./src/defaults.json');

function validateOptions(options) {
	Object.keys(options).forEach((option) => {
		if (!(option in defaults)) {
			throw new Error(`"${option}" is not a valid option`);
		}
	});
	if ('k1' in options && (typeof options.k1 !== 'number' || options.k1 < 0)) {
		throw new Error(`Invalid k1 value. Default is ${defaults.k1}`);
	}
	if ('k2' in options && (typeof options.k2 !== 'number' || options.k2 < 0)) {
		throw new Error(`Invalid k2 value. Default is ${defaults.k2}`);
	}
}

function getOptions(options) {
	validateOptions(options);
	return Object.assign({}, defaults, options);
}

function requireSameDimensions(pixels1, pixels2) {
	if (!hasSameDimensions(pixels1, pixels2)) {
		throw new Error('Image dimensions do not match');
	}

	return [pixels1, pixels2];
}

function getWindows(pixels1, pixels2, { windowSize, step }) {
	const windows1 = window.getWindows(pixels1, getLumaPixel, step, windowSize);
	const windows2 = window.getWindows(pixels2, getLumaPixel, step, windowSize);

	return [windows1, windows2];
}

function getSSIMs(windows1, windows2, options) {
	return windows1.map((w1, index) => ssim(w1, windows2[index], options));
}

function main(image1 = force('image1'), image2 = force('image2'), options = {}) {
	options = getOptions(options);

	return Promise.all([readpixels(image1), readpixels(image2)])
		.then(([pixels1, pixels2]) => requireSameDimensions(pixels1, pixels2))
		.then(([pixels1, pixels2]) => getWindows(pixels1, pixels2, options))
		.then(([windows1, windows2]) => getSSIMs(windows1, windows2, options))
		.then(average);
}

module.exports = main;
