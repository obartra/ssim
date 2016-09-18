const ndarray = require('ndarray');
const { PNG } = require('pngjs');

/**
 * Reads a PNG image from a buffer and returns an ndarray with the pixel data matrix
 *
 * @method handlePNG
 * @param {Buffer} data - The input image buffer data
 * @param {pixels} pixels - The image dataset
 * @returns {ndarray} pixels - The image dataset
 * @public
 * @memberOf formatreader
 * @since 0.0.1
 */
module.exports = function handlePNG(data) {
	const png = new PNG();

	return new Promise((resolve, reject) => {
		png
		.parse(data, (err, imgData) => {
			if (err) {
				reject(err);
			}

			const pixels = ndarray(
				new Uint8Array(imgData.data), [
					/* eslint-disable no-bitwise */
					imgData.width | 0,
					imgData.height | 0, 4],
					[4, 4 * imgData.width | 0, 1
					/* eslint-enable no-bitwise */
				], 0);

			resolve(pixels);
		});
	});
};
