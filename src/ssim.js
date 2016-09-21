const { multiply2d, add2d, divide2d, square2d, sum2d } = require('./math');
const { fspecial, filter2, imfilter, skip2d, ones } = require('./matlab');

function ssim(pixels1, pixels2, options) {
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
		return standard(c1, c2, μ12, μ1Sq, μ2Sq, σ12, σ1Sq, σ2Sq);
	}
	return uiq(μ12, μ1Sq, μ2Sq, σ12, σ1Sq, σ2Sq);
}

function uiq(μ12, μ1Sq, μ2Sq, σ12, σ1Sq, σ2Sq) {
	const numerator1 = multiply2d(μ12, 2);
	const numerator2 = multiply2d(σ12, 2);
	const denominator1 = add2d(μ1Sq, μ2Sq);
	const denominator2 = add2d(σ1Sq, σ2Sq);

	return divide2d(
		multiply2d(numerator1, numerator2),
		multiply2d(denominator1, denominator2)
	);
}

function standard(c1, c2, μ12, μ1Sq, μ2Sq, σ12, σ1Sq, σ2Sq) {
	const num1 = add2d(multiply2d(μ12, 2), c1);
	const num2 = add2d(multiply2d(σ12, 2), c2);
	const denom1 = add2d(add2d(μ1Sq, μ2Sq), c1);
	const denom2 = add2d(add2d(σ1Sq, σ2Sq), c2);

	return divide2d(multiply2d(num1, num2), multiply2d(denom1, denom2));
}

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
