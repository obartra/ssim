const {
	add2d,
	divide2d,
	multiply2d,
	square2d,
	sum2d
} = require('./math');
const {
	filter2,
	fspecial,
	imfilter,
	ones,
	skip2d
} = require('./matlab');

/**
 * Generates a SSIM map based on two input image matrices. For images greater than 512 pixels, it
 * will downsample them.
 *
 * Images must be a 2-Dimensional grayscale image
 *
 * This method is a line-by-line port of `assets/ssim.m`. Some operations are more verbose here
 * since more logic is needed in JS to manipulate matrices than in Matlab
 *
 * Note that setting `options1.k1` and `options.k2` to 0 will generate the UQI (Universal Quality
 * Index), since it's a special case of SSIM. In general that's undesierable since `k1` and `k2`
 * contribute to the stabilization coeficients `c1` and `c2`.
 *
 * For a mathematically equivalent and more efficient implementation check `./ssim.js`.
 *
 * @method originalSsim
 * @param {Array.<Array.<Number>>} pixels1 - The reference matrix
 * @param {Array.<Array.<Number>>} pixels2 - The second matrix to compare against
 * @param {Object} options - The input options parameter
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 * @since 0.0.2
 */
function originalSsim(pixels1, pixels2, options) { // eslint-disable-line max-statements
	// Exceeding max-statements to preserve the structure of the original Matlab script

	let w = fspecial('gaussian', options.windowSize, 1.5);
	const L = Math.pow(2, options.bitDepth) - 1;
	const c1 = Math.pow(options.k1 * L, 2);
	const c2 = Math.pow(options.k2 * L, 2);

	w = divide2d(w, sum2d(w));

	if (options.downsample === 'original') {
		const factor = Math.min(pixels1.width, pixels1.height) / options.maxSize;
		const rfactor = Math.round(factor);
		const f = Math.max(1, rfactor);

		if (f > 1) {
			let lpf = ones(f);

			lpf = divide2d(lpf, sum2d(lpf));
			pixels1 = imfilter(pixels1, lpf, 'symmetric', 'same');
			pixels2 = imfilter(pixels2, lpf, 'symmetric', 'same');

			pixels1 = skip2d(pixels1, [0, f, pixels1.height], [0, f, pixels1.width]);
			pixels2 = skip2d(pixels2, [0, f, pixels2.height], [0, f, pixels2.width]);
		}
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

module.exports = {
	originalSsim
};
