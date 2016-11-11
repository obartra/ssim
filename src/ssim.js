const {
	add2d,
	divide2d,
	multiply2d,
	square2d,
	sum2d
} = require('./math');
const {
	conv2,
	dimfilter,
	normpdf,
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
 * @param {Array.<Array.<Array.<Number>>>} pixels1 - The reference rgb matrix
 * @param {Array.<Array.<Array.<Number>>>} pixels2 - The second rgb matrix to compare against
 * @param {Object} options - The input options parameter
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf ssim
 */
function ssim(pixels1, pixels2, options) {
	let w = normpdf(getRange(options.windowSize), 0, 1.5);
	const L = (2 ** options.bitDepth) - 1;
	const c1 = (options.k1 * L) ** 2;
	const c2 = (options.k2 * L) ** 2;

	w = divide2d(w, sum2d(w));
	const wt = transpose(w);

	if (options.downsample === 'original') {
		[pixels1, pixels2] = downsample(pixels1, pixels2, options.maxSize);
	}
	const μ1 = conv2(pixels1, w, wt, 'valid');
	const μ2 = conv2(pixels2, w, wt, 'valid');
	const μ1Sq = square2d(μ1);
	const μ2Sq = square2d(μ2);
	const μ12 = multiply2d(μ1, μ2);
	const pixels1Sq = square2d(pixels1);
	const pixels2Sq = square2d(pixels2);
	const minusμ1Sq = multiply2d(μ1Sq, -1);
	const minusμ2Sq = multiply2d(μ2Sq, -1);
	const minusμ12 = multiply2d(μ12, -1);
	const σ1Sq = add2d(conv2(pixels1Sq, w, wt, 'valid'), minusμ1Sq);
	const σ2Sq = add2d(conv2(pixels2Sq, w, wt, 'valid'), minusμ2Sq);
	const σ12 = add2d(conv2(multiply2d(pixels1, pixels2), w, wt, 'valid'), minusμ12);

	if (c1 > 0 && c2 > 0) {
		return genSSIM(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq, c1, c2);
	}
	return genUQI(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq);
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
	const data = [];

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
 * Generates the ssim_map based on the intermediate values of the convolutions of the input with the
 * gaussian filter.
 *
 * These methods apply when K1 or K2 are not 0 (non UQI)
 *
 * @method genSSIM
 * @param {Array.<Array.<Number>>} μ12 - The cell-by cell multiplication of both images convolved
 * with the gaussian filter
 * @param {Array.<Array.<Number>>} σ12 - The convolution of cell-by cell multiplication of both
 * images minus μ12
 * @param {Array.<Array.<Number>>} μ1Sq - The convolution of image1 with the gaussian filter squared
 * @param {Array.<Array.<Number>>} μ2Sq - The convolution of image2 with the gaussian filter squared
 * @param {Array.<Array.<Number>>} σ1Sq - The convolution of image1^2, minus μ1Sq
 * @param {Array.<Array.<Number>>} σ2Sq - The convolution of image2^2, minus μ2Sq
 * @param {Number} c1 - The first stability constant
 * @param {Number} c2 - The second stability constant
 * @returns {Array.<Array.<Number>>} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genSSIM(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq, c1, c2) {
	const num1 = add2d(multiply2d(μ12, 2), c1);
	const num2 = add2d(multiply2d(σ12, 2), c2);
	const denom1 = add2d(add2d(μ1Sq, μ2Sq), c1);
	const denom2 = add2d(add2d(σ1Sq, σ2Sq), c2);

	return divide2d(multiply2d(num1, num2), multiply2d(denom1, denom2));
}

/**
 * Generates the Universal Quality Index (UQI) ssim_map based on the intermediate values of the
 * convolutions of the input with the gaussian filter.
 *
 * These methods apply when K1 or K2 are 0 (UQI)
 *
 * @method genUQI
 * @param {Array.<Array.<Number>>} μ12 - The cell-by cell multiplication of both images convolved
 * with the gaussian filter
 * @param {Array.<Array.<Number>>} σ12 - The convolution of cell-by cell multiplication of both
 * images minus μ12
 * @param {Array.<Array.<Number>>} μ1Sq - The convolution of image1 with the gaussian filter squared
 * @param {Array.<Array.<Number>>} μ2Sq - The convolution of image2 with the gaussian filter squared
 * @param {Array.<Array.<Number>>} σ1Sq - The convolution of image1^2, minus μ1Sq
 * @param {Array.<Array.<Number>>} σ2Sq - The convolution of image2^2, minus μ2Sq
 * @returns {Array.<Array.<Number>>} ssim_map - The generated map of SSIM values at each window
 * @private
 * @memberOf ssim
 */
function genUQI(μ12, σ12, μ1Sq, μ2Sq, σ1Sq, σ2Sq) {
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
 * @param {Array.<Array.<Number>>} pixels1 - The first matrix to downsample
 * @param {Array.<Array.<Number>>} pixels2 - The second matrix to downsample
 * @param {number} [maxSize=256] - The maximum size on the smallest dimension
 * @returns {Array.<Array.<Number>>} ssim_map - A matrix containing the map of computed SSIMs
 * @private
 * @memberOf ssim
 */
function downsample(pixels1, pixels2, maxSize = 256) {
	const factor = Math.min(pixels1.width, pixels2.height) / maxSize;
	const f = Math.round(factor);

	if (f > 1) {
		const { filter, filtert } = getDecomposedBlockFilter(f);

		pixels1 = imageDownsample(pixels1, filter, filtert, f);
		pixels2 = imageDownsample(pixels2, filter, filtert, f);
	}

	return [pixels1, pixels2];
}

/**
 * For a given 1D symmetrical filter `filter` and it's decomposed counterpart `filtert`, downsize
 * image `pixels` by a factor of `f`.
 *
 * @method imageDownsample
 * @param {Array.<Array.<Number>>} pixels - The matrix to downsample
 * @param {Array.<Number>} filter - The 1D decomposed filter to convolve the image with
 * @param {Array.<Array.<Number>>} filtert - The second component of the decomposed filter
 * @param {number} f - The downsampling factor (`image size / f`)
 * @returns {Array.<Array.<Number>>} imdown - The downsampled, filtered image
 * @private
 * @memberOf ssim
 */
function imageDownsample(pixels, filter, filtert, f) {
	const imdown = dimfilter(pixels, filter, filtert, 'symmetric', 'same');

	return skip2d(imdown, [0, f, imdown.height], [0, f, imdown.width]);
}

/**
 * Decomposes a block filter into 2 1D kernels
 *
 * @method getDecomposedBlockFilter
 * @param {Number} length - The size of the filter
 * @returns {Object} decomposed - The decomposed 1D components, `filter` and `filtert`
 * @private
 * @memberOf ssim
 */
function getDecomposedBlockFilter(length) {
	const filterCell = Math.sqrt(1 / (length * length));
	const data = [];

	for (let i = 0; i < length; i++) {
		data[i] = filterCell;
	}

	return {
		filter: {
			data,
			width: length,
			height: 1
		},
		filtert: {
			data,
			width: 1,
			height: length
		}
	};
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
