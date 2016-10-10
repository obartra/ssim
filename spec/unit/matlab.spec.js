const test = require('blue-tape');
const matlab = require('../../src/matlab');

test('should expose matlab related methods', (t) => {
	t.equal(typeof matlab, 'object');
	t.equal(typeof matlab.conv2, 'function');
	t.equal(typeof matlab.filter2, 'function');
	t.equal(typeof matlab.fspecial, 'function');
	t.equal(typeof matlab.imfilter, 'function');
	t.equal(typeof matlab.ones, 'function');
	t.equal(typeof matlab.rgb2gray, 'function');
	t.equal(typeof matlab.skip2d, 'function');
	t.equal(typeof matlab.zeros, 'function');
	t.end();
});
