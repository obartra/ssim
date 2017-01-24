const { average, variance, covariance } = require('./math');
const { sub } = require('./matlab');

/**
 * Generates a SSIM map based on two input image matrices.
 *
 * Images must be a 2-Dimensional grayscale image
 *
 * This method produces a simliar output to `assets/ssim.m` (~1%) when running on Matlab. It's based
 * of Igor Bezkrovny's TypeScript implementation
 *
 * @method bezkrovnySsim
 * @param {Object} pixels1 - The reference matrix
 * @param {Object} pixels2 - The second matrix to compare against
 * @param {Object} options - The input options parameter
 * @returns {Object} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf bezkrovnySsim
 */
function bezkrovnySsim(pixels1, pixels2, options) {
	const windowSize = options.windowSize;
	const width = Math.floor(pixels1.width / windowSize);
	const height = Math.floor(pixels1.height / windowSize);
	const data = new Array(width * height);
	let counter = 0;

	for (let y = 0; y < pixels1.height; y += windowSize) {
		for (let x = 0; x < pixels1.width; x += windowSize) {
			const windowWidth = Math.min(windowSize, pixels1.width - x);
			const windowHeight = Math.min(windowSize, pixels1.height - y);

			const values1 = sub(pixels1, x, windowHeight, y, windowWidth);
			const values2 = sub(pixels2, x, windowHeight, y, windowWidth);

			data[counter++] = windowSsim(values1, values2, options);
		}
	}
	return { data, width, height };
}

/**
 * Generates the per-window ssim value
 *
 * @method windowSsim
 * @param {Object} values1 - The matrix of the ssim window to compute for image 1
 * @param {Object} values2 - The matrix of the ssim window to compute for image 2
 * @param {Object} options - The input options parameter
 * @returns {Number} ssim - The ssim value at the current window
 * @private
 * @memberOf bezkrovnySsim
 */
function windowSsim({ data: values1 }, { data: values2 }, { bitDepth, k1, k2 }) {
	const L = (2 ** bitDepth) - 1;
	const c1 = (k1 * L) ** 2;
	const c2 = (k2 * L) ** 2;
	const average1 = average(values1);
	const average2 = average(values2);
	const σSqx = variance(values1, average1);
	const σSqy = variance(values2, average2);
	const σxy = covariance(values1, values2, average1, average2);

	const numerator = (2 * average1 * average2 + c1) * (2 * σxy + c2);
	const denom1 = (average1 ** 2 + average2 ** 2 + c1);
	const denom2 = σSqx + σSqy + c2;

	return numerator / (denom1 * denom2);
}

/**
 * Implements Bezkrovny's ssim-specific logic.
 *
 * Refactor of the TypeScript SSIM implementation by Bezkrovny, modified to match the api of ssim.js
 * and reduce duplication.
 *
 * The original work is available at: https://github.com/igor-bezkrovny/image-quantization which is
 * itself a port of the Java SSIM implementation available at https://github.com/rhys-e/structural-similarity
 * both under MIT license
 *
 * @namespace bezkrovnySsim
 */
module.exports = {
	bezkrovnySsim
};
