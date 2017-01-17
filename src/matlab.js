const { conv2 } = require('./matlab/conv2');
const { filter2 } = require('./matlab/filter2');
const { fspecial } = require('./matlab/fspecial');
const { imfilter } = require('./matlab/imfilter');
const { normpdf } = require('./matlab/normpdf');
const { ones } = require('./matlab/ones');
const { padarray } = require('./matlab/padarray');
const { rgb2gray } = require('./matlab/rgb2gray');
const { skip2d } = require('./matlab/skip2d');
const { sub } = require('./matlab/sub');
const { transpose } = require('./matlab/transpose');
const { zeros } = require('./matlab/zeros');

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
	filter2,
	fspecial,
	imfilter,
	normpdf,
	ones,
	padarray,
	rgb2gray,
	skip2d,
	sub,
	transpose,
	zeros
};
