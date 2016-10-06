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
 * Parses the buffer data and returns it
 *
 * @method parse
 * @param {Buffer} data - The input image buffer data
 * @returns {Promise} promise - A promise that resolves in an object containing the image 3d matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function parse(data) {
	const { ext } = imageType(data);
	let imageData;

	if (ext === 'bmp') {
		imageData = bmp.decode(data);
	} else {
		const img = new Canvas.Image();

		img.src = data;

		const canvas = new Canvas(img.width, img.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(img, 0, 0, img.width, img.height);

		imageData = ctx.getImageData(0, 0, img.width, img.height);
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
				res.on('end', () =>
					parse(Buffer.concat(chunks))
						.then(resolve)
						.catch(reject)
				);
			})
			.on('error', err => reject(err));
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
				return reject(err);
			}

			return parse(data).then(resolve).catch(reject);
		});
	});
}

/**
 * Reads image data from the input and returns it
 *
 * @method readpixels
 * @param {string|Buffer} url - A url, file path or buffer to use to load the image data
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @public
 * @memberOf readpixels
 * @since 0.0.1
 */
function readpixels(url) {
	if (Buffer.isBuffer(url)) {
		return parse(url);
	} else if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
		return loadUrl(url);
	}
	return loadFs(url);
}

/**
 * Image loading logic
 *
 * @namespace readpixels
 */
module.exports = {
	readpixels
};
