const ndarray = require('ndarray');
const { GifReader } = require('omggif');

/**
 * Reads a GIF image from a buffer and returns an ndarray with the pixel data matrix
 *
 * @method handleGIF
 * @param {Buffer} data - The input image buffer data
 * @returns {ndarray} pixels - The image dataset
 * @public
 * @memberOf formatreader
 * @since 0.0.1
 */
module.exports = function handleGIF(data) {
	return new Promise((resolve, reject) => {
		try {
			const reader = new GifReader(data);

			if (reader.numFrames() > 0) {
				const nshape = [reader.numFrames(), reader.height, reader.width, 4];
				const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3]);
				const result = ndarray(ndata, nshape);

				for (let i = 0; i < reader.numFrames(); ++i) {
					const subarray = ndata.subarray(
						result.index(i, 0, 0, 0),
						result.index(i + 1, 0, 0, 0)
					);

					reader.decodeAndBlitFrameRGBA(i, subarray);
				}

				resolve(result.transpose(0, 2, 1));
			} else {
				const nshape = [reader.height, reader.width, 4];
				const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2]);
				const result = ndarray(ndata, nshape);

				reader.decodeAndBlitFrameRGBA(0, ndata);
				resolve(result.transpose(1, 0));
			}
		} catch (err) {
			reject(err);
		}
	});
};
