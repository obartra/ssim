const test = require('blue-tape');
const matlab = require('../../src/matlab');

test('should expose matlab related methods', (t) => {
	t.equal(typeof matlab, 'object');
	[
		'conv2',
		'filter2',
		'fspecial',
		'imfilter',
		'normpdf',
		'ones',
		'padarray',
		'rgb2gray',
		'skip2d',
		'transpose',
		'zeros'
	].forEach(method => t.equal(typeof matlab[method], 'function'));
	t.end();
});
