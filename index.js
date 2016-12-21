const { readpixels } = require('./src/readpixels');
const { rgb2gray } = require('./src/matlab');
const { mean2d } = require('./src/math');
const { ssim } = require('./src/ssim');
const { originalSsim } = require('./src/originalSsim');
const { force } = require('./src/util');
const defaults = require('./src/defaults.json');
const { version } = require('./version.js');
const promiz = require('promiz');

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

function validateDimensions(pixels) {
	if (pixels[0].width !== pixels[1].width || pixels[0].height !== pixels[1].height) {
		throw new Error('Image dimensions do not match');
	}

	return pixels;
}

function toGrayScale(pixels) {
	return [rgb2gray(pixels[0]), rgb2gray(pixels[1])];
}

function readImage(image, options) {
	if (options.downsample === 'fast') {
		return readpixels(image, singleSSIM.Promise, options.maxSize);
	}
	return readpixels(image, singleSSIM.Promise);
}

function singleSSIM(image1 = force('image1'), image2 = force('image2'), options = {}) {
	const start = new Date().getTime();

	options = getOptions(options);

	const ssimImpl = options.ssim === 'fast' ? ssim : originalSsim;

	return singleSSIM.Promise.all([readImage(image1, options), readImage(image2, options)])
		.then(validateDimensions)
		.then(toGrayScale)
		.then(pixels => ssimImpl(pixels[0], pixels[1], options))
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
singleSSIM.ssim = ssim;
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
