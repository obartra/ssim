const { getDimensions } = require('./image');
const { times, timesEvery } = require('./util');

/**
 * Determines the window size. It's the minimum value of the image dimensions and the desired window
 * size
 *
 * @method getWindowSize
 * @param {Object} imgSize - An object containing width and height for the target image
 * @param {Number} windowSize - The maximum window size to use
 * @returns {Number} size - The actual window size to use
 * @private
 * @memberOf window
 * @since 0.0.1
 */
function getWindowSize(imgSize, windowSize) {
	return Math.min(windowSize, imgSize.width, imgSize.height);
}

/**
 * Calls `cb` on each pixel of the window and returns the values in an array
 *
 * @method callWindow
 * @param {Object} x - The left coordinate position
 * @param {Object} y - The top coordinate position
 * @param {ndarray} pixels - The image dataset
 * @param {Number} windowSize - The window size to use
 * @param {Function} cb - A callback method called for every pixel
 * @returns {Any[]} array - An array with the values returned by `cb` invoked on each pixel
 * @private
 * @memberOf window
 * @since 0.0.1
 */
function callWindow(x, y, pixels, windowSize, cb) {
	return times(windowSize).reduce((acc, width) =>
		[...acc, ...times(windowSize).map(height => cb(y + height, x + width, pixels))]
	, []);
}

/**
 * Generates a list of windows to use and invokes a function for each pixel. Its returned value is
 * used as the window pixel value
 *
 * @method getWindows
 * @param {ndarray} pixels - The image dataset
 * @param {Function} cb - A callback method called for every pixel
 * @param {Number} [windowSize=8] - The maximum window size to use
 * @param {Number} [step=8] - The number of pixels to skip when computing windows. E.g. A `step` of
 * 2 will generate windows at [0, 0], [0, 2], [2, 0], [2, 2] and so on.
 * @returns {Array[]} arrays - An array of arrays containing the values returned by `cb` on each
 * pixel
 * @public
 * @memberOf window
 * @since 0.0.1
 */
function getWindows(pixels, cb, windowSize, step) {
	const imgSize = getDimensions(pixels);

	windowSize = getWindowSize(imgSize, windowSize, step);

	return timesEvery(imgSize.width - (windowSize - 1), step).reduce((acc, x) =>
		[...acc, ...timesEvery(imgSize.height - (windowSize - 1), step).map(y =>
			callWindow(x, y, pixels, windowSize, cb)
		)]
	, []);
}

/**
 * Methods related to window size and position
 *
 * @namespace window
 */
module.exports = {
	getWindows
};
