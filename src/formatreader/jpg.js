const ndarray = require('ndarray');
const jpeg = require('jpeg-js');

/**
 * Reads a JPEG image from a buffer and returns an ndarray with the pixel data matrix
 *
 * @method handleJPEG
 * @param {Buffer} data - The input image buffer data
 * @returns {ndarray} pixels - The image dataset
 * @public
 * @memberOf formatreader
 * @since 0.0.1
 */
module.exports = function handleJPEG(data) {
	return new Promise((resolve, reject) => {
		try {
			const jpegData = jpeg.decode(data);

			if (!jpegData) {
				reject(new Error('Error decoding jpeg'));
			} else {
				const nshape = [jpegData.height, jpegData.width, 4];
				const result = ndarray(jpegData.data, nshape);
				const pixels = result.transpose(1, 0);

				resolve(pixels);
			}
		} catch (e) {
			reject(e);
		}
	});
};
