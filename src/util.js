/**
 * If `limit` is set, it will return proportional dimensions to `width` and `height` with the
 * smallest dimesion limited to `limit`.
 *
 * @method getLimitDimensions
 * @param {number} width - The input width size, in pixels
 * @param {number} height - The input height size, in pixels
 * @param {number} [limit] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Object} dimensions - A key value pair containing the width / height to use, downsized
 * when appropriate
 * @memberOf util
 * @since 0.0.4
 */
function getLimitDimensions(width, height, limit) {
	if (limit && width >= limit && height >= limit) {
		const ratio = width / height;

		if (ratio > 1) {
			return { height: limit, width: Math.round(limit / ratio) };
		}
		return { height: Math.round(limit * ratio), width: limit };
	}
	return { width, height };
}

/**
 * Convenience methods
 *
 * @namespace util
 */
module.exports = {
	getLimitDimensions
};
