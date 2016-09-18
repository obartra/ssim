const { average, variance, covariance } = require('./math');

/**
 * Computes the luminance as described on Wang et al 2003, "The luminance of the surface of an
 * object being observed is the product of the illumination and the reflectance, but the structures
 * of the objects in the scene are independent of the illumination".
 *
 * @method luminance
 * @param {Number[]} x - The reference window
 * @param {Number[]} y - The window to which compare the reference
 * @param {Number} c1 - first stability constant
 * @returns {Number} luminance - The luminance value for x, y and c1
 * @private
 * @memberOf ssim
 * @since 0.0.1
 */
function luminance(x, y, c1) {
	const x̄ = average(x);
	const ȳ = average(y);

	return (2 * x̄ * ȳ + c1) / (Math.pow(x̄, 2) + Math.pow(ȳ, 2) + c1);
}

/**
 * Computes the contrast as described on Wang et al 2003, which uses "the standard deviation (the
 * square root of variance) as an estimate of the signal contrast"
 *
 * @method const
 * @param {Number[]} x - The reference window
 * @param {Number[]} y - The window to which compare the reference
 * @param {Number} c2 - second stability constant
 * @returns {Number} contrast - The contrast value for x, y and c2
 * @private
 * @memberOf ssim
 * @since 0.0.1
 */
function contrast(x, y, c2) {
	const varx = variance(x);
	const vary = variance(y);

	return (2 * Math.sqrt(varx) * Math.sqrt(vary) + c2) / (varx + vary + c2);
}

/**
 * Computes the structural similarity, taking into account that natural images are "highly
 * structured: their pixels exhibit strong dependencies, especially when they are spatially
 * proximate, and these dependencies carry important information about the structure of the
 * objects".
 *
 * @method structure
 * @param {Number[]} x - The reference window
 * @param {Number[]} y - The window to which compare the reference
 * @param {Number} c2 - second stability constant
 * @returns {Number} structure - The structure value for x, y and c2
 * @private
 * @memberOf ssim
 * @since 0.0.1
 */
function structure(x, y, c2) {
	const varx = variance(x);
	const vary = variance(y);
	const c3 = c2 / 2;

	return (covariance(x, y) + c3) / (Math.sqrt(varx) * Math.sqrt(vary) + c3);
}

/**
 * Computes the SSIM value for a given window
 *
 * @method structure
 * @param {Number[]} x - The reference window
 * @param {Number[]} y - The window to which compare the reference
 * @param {Object} options - A simple object containing different parameters for SSIM, namely k1,
 * k2, α, β, γ, L. Their default values are set on `defaults.json`
 * @returns {Number} ssim - The ssim value for the target windows
 * @public
 * @memberOf ssim
 * @since 0.0.1
 */
function ssim(x, y, { k1, k2, α, β, γ, L }) {
	const c1 = Math.pow(k1 * L, 2);
	const c2 = Math.pow(k2 * L, 2);

	const l = Math.pow(luminance(x, y, c1), α);
	const c = Math.pow(contrast(x, y, c2), β);
	const s = Math.pow(structure(x, y, c2), γ);

	return l * c * s;
}

/**
 * Generates all ssim-specific computations
 *
 * @namespace ssim
 */
module.exports = {
	ssim
};
