const {
	add2d,
	subtract2d,
	divide2d,
	multiply2d,
	square2d,
	sum2d
} = require('./math');
const {
	conv2,
	imfilter,
	normpdf,
	ones,
	skip2d,
	transpose
} = require('./matlab');

/**
 * Generates a SSIM map based on two input image matrices. For images greater than 512 pixels, it
 * will downsample by default (unless `options.downsample` is set to falsy).
 *
 * Images must be a 2-Dimensional grayscale image
 *
 * This method produces the same exact output than `assets/ssim.m` when running on Matlab. It's
 * mathematically equivalent but it is not a line-by-line port. If you want a line-by-line port
 * check `originalSsim`. Several performance optimizations have been made here to achieve greater
 * performance.
 *
 * @method ssim
 * @param {Array.<Array.<Array.<Number>>>} img1 - The reference rgb matrix
 * @param {Array.<Array.<Array.<Number>>>} img2 - The second rgb matrix to compare against
 * @param {Object} options - The input options parameter
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 */
function ssim(img1, img2, options) {
	let w = normpdf(getRange(options.windowSize), 0, 1.5);
	const L = (2 ** options.bitDepth) - 1;
	const c1 = (options.k1 * L) ** 2;
	const c2 = (options.k2 * L) ** 2;

	w = divide2d(w, sum2d(w));

	const wt = transpose(w);

	if (options.downsample === 'original') {
		[img1, img2] = downsample(img1, img2, options.maxSize);
	}
	if (c1 > 0 && c2 > 0) {
		return genSSIM(img1, img2, w, wt, c1, c2);
	}
	return genUQI(img1, img2, w, wt);
}

/**
 * Generates a range of distances of size `2n+1` with increments of 1 and centered at 0.
 *
 * @example `getRange(2) => [2 1 0 1 2]
 * @method getRange
 * @param {Number} size - The maximum distance from the center
 * @returns {Array.<Number>} out - The generated vector
 * @private
 * @memberOf ssim
 */
function getRange(size) {
	const offset = Math.floor(size / 2);
	const data = new Array(offset * 2 + 1);

	for (let x = -offset; x <= offset; x++) {
		data[x + offset] = Math.abs(x);
	}

	return {
		data,
		width: data.length,
		height: 1
	};
}

/**
 * Generates the ssim_map based on the based on the input images and the specified window
 *
 * These methods apply when K1 or K2 are not 0 (non UQI)
 *
 * @method genSSIM
 * @param {Array.<Array.<Array.<Number>>>} img1 - The reference rgb matrix
 * @param {Array.<Array.<Array.<Number>>>} img2 - The second rgb matrix to compare against
 * @param {Array.<Array.<Number>>} w - The first component of the decomposed gaussian window
 * @param {Array.<Array.<Number>>} wt - The transposed `w` window
 * @param {Number} c1 - The first stability constant
 * @param {Number} c2 - The second stability constant
 * @returns {Array.<Array.<Number>>} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genSSIM(img1, img2, w, wt, c1, c2) {
	const μ1 = conv2(img1, w, wt, 'valid');
	const μ2 = conv2(img2, w, wt, 'valid');
	const μ1Sq = square2d(μ1);
	const μ2Sq = square2d(μ2);
	const μ12 = multiply2d(μ1, μ2);
	const σ1Sq = subtract2d(conv2(square2d(img1), w, wt, 'valid'), μ1Sq);
	const σ2Sq = subtract2d(conv2(square2d(img2), w, wt, 'valid'), μ2Sq);
	const σ12 = subtract2d(conv2(multiply2d(img1, img2), w, wt, 'valid'), μ12);

	const num1 = add2d(multiply2d(μ12, 2), c1);
	const num2 = add2d(multiply2d(σ12, 2), c2);
	const den1 = add2d(add2d(μ1Sq, μ2Sq), c1);
	const den2 = add2d(add2d(σ1Sq, σ2Sq), c2);

	return divide2d(multiply2d(num2, num1), multiply2d(den2, den1));
}

/**
 * Generates the Universal Quality Index (UQI) ssim_map based on the input images and the specified
 * window
 *
 * These methods apply when K1 or K2 are 0 (UQI)
 *
 * @method genUQI
 * @param {Array.<Array.<Array.<Number>>>} img1 - The reference rgb matrix
 * @param {Array.<Array.<Array.<Number>>>} img2 - The second rgb matrix to compare against
 * @param {Array.<Array.<Number>>} w - The first component of the decomposed gaussian window
 * @param {Array.<Array.<Number>>} wt - The transposed `w` window
 * @returns {Array.<Array.<Number>>} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genUQI(img1, img2, w, wt) {
	const μ1 = conv2(img1, w, wt, 'valid');
	const μ2 = conv2(img2, w, wt, 'valid');
	const μ12 = multiply2d(μ1, μ2);
	const img1Sq = square2d(img1);
	const img2Sq = square2d(img2);
	const μ1Sq = square2d(μ1);
	const μ2Sq = square2d(μ2);
	const σ1Sq = subtract2d(conv2(img1Sq, w, wt, 'valid'), μ1Sq);
	const σ2Sq = subtract2d(conv2(img2Sq, w, wt, 'valid'), μ2Sq);
	const σ12 = subtract2d(conv2(multiply2d(img1, img2), w, wt, 'valid'), μ12);

	const numerator1 = multiply2d(μ12, 2);
	const numerator2 = multiply2d(σ12, 2);
	const denominator1 = add2d(μ1Sq, μ2Sq);
	const denominator2 = add2d(σ1Sq, σ2Sq);

	return divide2d(
		multiply2d(numerator1, numerator2),
		multiply2d(denominator1, denominator2)
	);
}

/**
 * Downsamples images greater than `maxSize` pixels on the smallest direction. If neither image
 * exceeds these dimensions they are returned as they are.
 *
 * The resulting MSSIM value may differ (downsizing vs not downsizing) but it should be a good
 * approximation.
 *
 * @method downsample
 * @param {Array.<Array.<Number>>} img1 - The first matrix to downsample
 * @param {Array.<Array.<Number>>} img2 - The second matrix to downsample
 * @param {number} [maxSize=256] - The maximum size on the smallest dimension
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @private
 * @memberOf ssim
 */
function downsample(img1, img2, maxSize = 256) {
	const factor = Math.min(img1.width, img2.height) / maxSize;
	const f = Math.round(factor);

	if (f > 1) {
		let lpf = ones(f);

		lpf = divide2d(lpf, sum2d(lpf));

		img1 = imageDownsample(img1, lpf, f);
		img2 = imageDownsample(img2, lpf, f);
	}

	return [img1, img2];
}

/**
 * For a given 2D filter `filter`, downsize image `img` by a factor of `f`.
 *
 * @method imageDownsample
 * @param {Array.<Array.<Number>>} img - The matrix to downsample
 * @param {Array.<Number>} filter - The filter to convolve the image with
 * @param {number} f - The downsampling factor (`image size / f`)
 * @returns {Array.<Array.<Number>>} imdown - The downsampled, filtered image
 * @private
 * @memberOf ssim
 */
function imageDownsample(img, filter, f) {
	const imdown = imfilter(img, filter, 'symmetric', 'same');

	return skip2d(imdown, 0, f, imdown.height, 0, f, imdown.width);
}

/**
 * Implements all ssim-specific logic.
 *
 * Reproduces the original SSIM matlab scripts. For a direct comparison you may want to check the
 * scripts contained within `/assets`
 *
 * @namespace ssim
 */
module.exports = {
	ssim
};
