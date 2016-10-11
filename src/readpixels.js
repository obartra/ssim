const fs = require('fs');
const http = require('https');
const Canvas = require('canvas');
const imageType = require('image-type');
const bmp = require('bmp-js');

/**
 * Parses the buffer data and converts it into a 3d matrix
 *
 * @method bufferToMatrix
 * @param {Object} imageData - An image data object (the matrix and dimensions)
 * @returns {Array.<Array.<Array.<Number>>>} image - A 3d image matrix
 * @private
 * @memberOf bufferToMatrix
 * @since 0.0.2
 */
function bufferToMatrix(imageData) {
	const matrix = [];
	const d = imageData.data;

	for (let x = 0; x < imageData.width; x++) {
		matrix[x] = [];
		for (let y = 0; y < imageData.height; y++) {
			const index = (x + y * imageData.width) * 4;

			matrix[x][y] = [d[index], d[index + 1], d[index + 2], d[index + 3]];
		}
	}

	return matrix;
}
/**
 * If `limit` is set, it will generate proportional dimensions to `width` and `height` with the
 * smallest dimesion limited to `limit`.
 *
 * @method getImageDimensions
 * @param {number} width - The input width size, in pixels
 * @param {number} height - The input height size, in pixels
 * @param {number} [limit] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Object} dimensions - A key value pair containing the width / height to use, downsized
 * when appropriate
 * @memberOf readpixels
 * @since 0.0.4
 */
function getImageDimensions(width, height, limit) {
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
 * Parses the buffer data and returns it. If `limit` is set, it will make sure the smallest dimesion
 * will at most be of size `limit`.
 *
 * @method parse
 * @param {Buffer} data - The input image buffer data
 * @param {number} [limit] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Promise} promise - A promise that resolves in an object containing the image 3d matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function parse(data, limit) {
	const { ext } = imageType(data);
	let imageData;

	if (ext === 'bmp') {
		imageData = bmp.decode(data);
	} else {
		const img = new Canvas.Image();

		img.src = data;

		const { width, height } = getImageDimensions(img.width, img.height, limit);
		const canvas = new Canvas(width, height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

		imageData = ctx.getImageData(0, 0, width, height);
	}

	return new Promise((resolve) => {
		resolve(bufferToMatrix(imageData));
	});
}

/**
 * Reads image data from a url and returns it
 *
 * @method loadUrl
 * @param {string} url - url to load image data from
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadUrl(url) {
	return new Promise((resolve, reject) => {
		http
			.get(url)
			.on('response', (res) => {
				const chunks = [];

				res.on('data', data => chunks.push(data));
				res.on('end', () => resolve(Buffer.concat(chunks)));
			})
			.on('error', reject);
	});
}

/**
 * Reads image data from the file system and returns it
 *
 * @method loadFs
 * @param {string} path - File path to load image data from
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadFs(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(data);
		});
	});
}

/**
 * Reads image data from the input and returns it
 *
 * @method readpixels
 * @param {string|Buffer} url - A url, file path or buffer to use to load the image data
 * @param {number} [limit=0] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @public
 * @memberOf readpixels
 * @since 0.0.1
 */
function readpixels(url, limit = 0) {
	let bufferPromise;

	if (Buffer.isBuffer(url)) {
		bufferPromise = Promise.resolve(url);
	} else if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
		bufferPromise = loadUrl(url);
	} else {
		bufferPromise = loadFs(url);
	}
	return bufferPromise
		.then(bufferData => parse(bufferData, limit));
}

/**
 * Image loading logic
 *
 * @namespace readpixels
 */
module.exports = {
	readpixels
};
