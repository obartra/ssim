const { readpixels } = require('./src/readpixels');
const { rgb2gray } = require('./src/matlab');
const { mean2d } = require('./src/math');
const { ssim } = require('./src/ssim');
const { originalSsim } = require('./src/originalSsim');
const { bezkrovnySsim } = require('./src/bezkrovnySsim');
const { downsample } = require('./src/downsample');
const defaults = require('./src/defaults.json');
const { version } = require('./version.js');
const promiz = require('promiz');

const ssimTargets = {
	fast: ssim,
	original: originalSsim,
	bezkrovny: bezkrovnySsim
};

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
	if (!(options.ssim in ssimTargets)) {
		throw new Error(`Invalid ssim option (use: ${Object.keys(ssimTargets).join(', ')})`);
	}
}

function getOptions(userOptions) {
	return new singleSSIM.Promise((resolve) => {
		const options = Object.assign({}, defaults, userOptions);

		validateOptions(options);

		resolve(options);
	});
}

function validateDimensions([pixels1, pixels2, options]) {
	if (pixels1.width !== pixels2.width || pixels1.height !== pixels2.height) {
		throw new Error('Image dimensions do not match');
	}

	return [pixels1, pixels2, options];
}

function toGrayScale([pixels1, pixels2, options]) {
	return [rgb2gray(pixels1), rgb2gray(pixels2), options];
}

function toResize([pixels1, pixels2, options]) {
	const pixels = downsample([pixels1, pixels2], options);

	return [pixels[0], pixels[1], options];
}

function comparison([pixels1, pixels2, options]) {
	return ssimTargets[options.ssim](pixels1, pixels2, options);
}

function readImage(image, options) {
	if (!image) {
		throw new Error('Missing image parameter');
	} else if (options.downsample === 'fast') {
		return readpixels(image, singleSSIM.Promise, options.maxSize);
	}
	return readpixels(image, singleSSIM.Promise);
}

function readImages(image1, image2, options) {
	return singleSSIM.Promise.all([
		readImage(image1, options),
		readImage(image2, options)
	]).then(images => [images[0], images[1], options]);
}

function singleSSIM(image1, image2, userOptions) {
	const start = new Date().getTime();

	return getOptions(userOptions)
		.then(options => readImages(image1, image2, options))
		.then(validateDimensions)
		.then(toGrayScale)
		.then(toResize)
		.then(comparison)
		.then(ssimMap => ({
			ssim_map: ssimMap,
			mssim: mean2d(ssimMap),
			performance: new Date().getTime() - start
		}));
}

/**
 * @method Promise - The Promise definition to use. It defaults to the native ES6 implementation
 * and falls back to `promiz` when not available. Alternatively, it can be replaced by any
 * Promises/A+ compliant implementation.
 * @public
 */
singleSSIM.Promise = this.Promise || promiz;
/**
 * @method ssim - The ssim method. You can call the package directly or through the `ssim` property.
 * @public
 * @example const mod = require('ssim.js');
 * mod('/img1.jpg', '/img2.jpg');
 * mod.ssim('/img1.jpg', '/img2.jpg');
 */
singleSSIM.ssim = singleSSIM;
/**
 * @property {String} version - The SSIM package version
 * @public
 */
singleSSIM.version = version;

/**
 * SSIM External API
 *
 * @module main
 */
module.exports = singleSSIM;
