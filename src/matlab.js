const { conv2 } = require('./matlab/conv2');
const { rgb2gray } = require('./matlab/rgb2gray');
const { ones } = require('./matlab/ones');
const { zeros } = require('./matlab/zeros');
const { padarray } = require('./matlab/padarray');
const { filter2 } = require('./matlab/filter2');
const { fspecial } = require('./matlab/fspecial');
const { imfilter } = require('./matlab/imfilter');
const { skip2d } = require('./matlab/skip2d');

/**
 * Implements Matlab functions or functionality.
 *
 * The goal here is not a perfect reproduction of matlab logic but just a minimal implementation
 * needed to correctly reproduce the SSIM matlab script.
 *
 * That means that functionality used will be implemented but additional / unused parameters will
 * not.
 *
 * @namespace matlab
 */
module.exports = {
	conv2,
	fspecial,
	filter2,
	zeros,
	ones,
	padarray,
	imfilter,
	skip2d,
	rgb2gray
};
