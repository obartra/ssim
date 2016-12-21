/* eslint-env browser */
const { getLimitDimensions } = require('./util');

/**
 * Reads image data from the input and returns it
 *
 * @method readpixels
 * @param {string} url - The url to use to load the image data
 * @param {function} P - The Promise definition, must be a valid Promises/A+ implementation
 * @param {number} [limit=0] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @public
 * @memberOf readpixelsWeb
 */
function readpixels(url, P, limit = 0) {
	const img = new Image();
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	return new P((resolve, reject) => {
		img.onload = () => {
			const { width, height } = getLimitDimensions(img.width, img.height, limit);

			if (width === 0 || height === 0) {
				return reject('Failed to load image');
			}

			canvas.width = width;
			canvas.height = height;

			ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
			return resolve(ctx.getImageData(0, 0, width, height));
		};
		img.onerror = reject;
		img.src = url;
	});
}

/**
 * Image loading logic implementation for the front end build, limited to url loading but with the
 * same public interface than `readpixels.js`
 *
 * @namespace readpixelsWeb
 */
module.exports = {
	readpixels
};
