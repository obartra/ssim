const fs = require('fs');
const request = require('request');
const mime = require('mime-types');

const { force } = require('./util');
const handlePNG = require('./formatreader/png');
const handleJPEG = require('./formatreader/jpg');
const handleGIF = require('./formatreader/gif');

/**
 * Parses the buffer data based on the given mime type and generates an object containing all pixel
 * and dimensions data
 *
 * @method doParse
 * @param {string} type - The mime type of the image used
 * @param {Buffer} data - The input image buffer data
 * @returns {ndarray} pixels - The image dataset
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function doParse(type = force('type'), data) {
	switch (type) {
	case 'image/png':
		return handlePNG(data);
	case 'image/jpg':
	case 'image/jpeg':
		return handleJPEG(data);
	case 'image/gif':
		return handleGIF(data);
	default:
		return Promise.reject(new Error(`Unsupported file type: ${type}`));
	}
}

/**
 * Reads image data from a url and generates an object containing all pixel and dimensions data
 *
 * @method loadUrl
 * @param {string} url - url to load image data from
 * @param {string} [type] - The mime type to use to override the default
 * @returns {ndarray} pixels - The image dataset
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadUrl(url, type) {
	return new Promise((resolve, reject) => {
		request({ url, encoding: null }, (err, response, body) => {
			if (err) {
				return reject(err);
			} else if (!type) {
				if (response.getHeader !== undefined) {
					type = response.getHeader('content-type');
				} else if (response.headers !== undefined) {
					type = response.headers['content-type'];
				}
			}

			return doParse(type, body).then(resolve).catch(reject);
		});
	});
}

/**
 * Reads image data from the file system and generates an object containing all pixel and dimensions
 * data
 *
 * @method loadFs
 * @param {string} path - File path to load image data from
 * @param {string} [type] - The mime type to use to override the default
 * @returns {ndarray} pixels - The image dataset
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadFs(path, type) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				return reject(err);
			}

			type = type || mime.lookup(path);
			return doParse(type, data).then(resolve).catch(reject);
		});
	});
}

/**
 * Reads image data from the input and generates an object containing all pixel and dimensions data
 *
 * @method readpixels
 * @param {string|Buffer} url - A url, file path or buffer to use to load the image data
 * @param {string} [type] - The mime type. It is required if url is a buffer but not otherwise. If
 * not needed but these value is passed it will be used to coerce the mime type
 * @returns {ndarray} pixels - The image dataset
 * @public
 * @memberOf readpixels
 * @since 0.0.1
 */
function readpixels(url, type) {
	if (Buffer.isBuffer(url)) {
		return doParse(type, url);
	} else if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
		return loadUrl(url, type);
	}
	return loadFs(url, type);
}

/**
 * Image loading logic
 *
 * @namespace readpixels
 */
module.exports = {
	readpixels
};
