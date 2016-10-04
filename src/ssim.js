const { multiply2d, add2d, divide2d, square2d, sum2d } = require('./math');
const { fspecial, filter2, imfilter, skip2d, ones } = require('./matlab');

/**
 * Generates a SSIM map based on two input image matrices. For images greater than 512 pixels, it
 * will downsample by default (unless `options.downsample` is set to falsy).
 *
 * This method is a line-by-line port of `assets/ssim.m`. Some operations are more verbose here
 * since more logic is needed in JS to manipulate matrices than in Matlab
 *
 * Note that setting `options1.k1` and `options.k2` to 0 will generate the UQI (Universal Quality
 * Index), since it's a special case of SSIM. In general that's undesierable since `k1` and `k2`
 * contribute to the stabilization coeficients `c1` and `c2`.
 *
 * @method ssim
 * @param {Array.<Array.<Array.<Number>>>} pixels1 - The reference rgb matrix
 * @param {Array.<Array.<Array.<Number>>>} pixels2 - The second rgb matrix to compare against
 * the reference one
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 * @since 0.0.2
 */
function ssim(pixels1, pixels2, options) { // eslint-disable-line max-statements
	// Exceeding max-statements to preserve the structure of the original Matlab script

	let w = fspecial('gaussian', options.windowSize, 1.5);
	const L = Math.pow(2, options.bitDepth) - 1;
	const c1 = Math.pow(options.k1 * L, 2);
	const c2 = Math.pow(options.k2 * L, 2);

	w = divide2d(w, sum2d(w));

	if (options.downsample) {
		[pixels1, pixels2] = automaticDownsampling(pixels1, pixels2);
	}

	const μ1 = filter2(w, pixels1, 'valid');
	const μ2 = filter2(w, pixels2, 'valid');
	const μ1Sq = square2d(μ1);
	const μ2Sq = square2d(μ2);
	const μ12 = multiply2d(μ1, μ2);
	const pixels1Sq = square2d(pixels1);
	const pixels2Sq = square2d(pixels2);
	const minusμ1Sq = multiply2d(μ1Sq, -1);
	const minusμ2Sq = multiply2d(μ2Sq, -1);
	const minusμ12 = multiply2d(μ12, -1);
	const σ1Sq = add2d(filter2(w, pixels1Sq, 'valid'), minusμ1Sq);
	const σ2Sq = add2d(filter2(w, pixels2Sq, 'valid'), minusμ2Sq);
	const σ12 = add2d(filter2(w, multiply2d(pixels1, pixels2), 'valid'), minusμ12);

	if (c1 > 0 && c2 > 0) {
		const num1 = add2d(multiply2d(μ12, 2), c1);
		const num2 = add2d(multiply2d(σ12, 2), c2);
		const denom1 = add2d(add2d(μ1Sq, μ2Sq), c1);
		const denom2 = add2d(add2d(σ1Sq, σ2Sq), c2);

		return divide2d(multiply2d(num1, num2), multiply2d(denom1, denom2));
	}

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
 * Downsamples images greater than 256 pixels on the smallest direction. If neither image does they
 * are returned as they are.
 *
 * This can modifies the resulting SSIM index but should speed up processing.
 *
 * Unfortunately this implementation is so slow that's actual deterimental.
 *
 * @method automaticDownsampling
 * @param {Array.<Array.<Array.<Number>>>} pixels1 - The first rgb matrix to downsample
 * @param {Array.<Array.<Array.<Number>>>} pixels2 - The second rgb matrix to downsample
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @private
 * @memberOf ssim
 * @since 0.0.2
 */
function automaticDownsampling(pixels1, pixels2) {
	const factor = Math.min(pixels1[0].length, pixels2.length) / 256;
	const rfactor = Math.round(factor);
	const f = Math.max(1, rfactor);

	if (f > 1) {
		let lpf = ones(f);

		lpf = divide2d(lpf, sum2d(lpf));
		pixels1 = imfilter(pixels1, lpf, 'symmetric', 'same');
		pixels2 = imfilter(pixels2, lpf, 'symmetric', 'same');
		const rowLength = pixels1.length;
		const colLength = pixels1[0].length;

		pixels1 = skip2d(pixels1, [0, f, rowLength], [0, f, colLength]);
		pixels2 = skip2d(pixels2, [0, f, rowLength], [0, f, colLength]);
	}

	return [pixels1, pixels2];
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
