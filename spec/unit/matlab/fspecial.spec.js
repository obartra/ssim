const test = require('blue-tape');
const { fspecial } = require('../../../src/matlab/fspecial');
const { round } = require('../../helpers/round');

test('should create a gaussian low pass filter of different dimensions', (t) => {
	const fspecial3 = fspecial('gaussian', 3);
	const fspecial11 = fspecial('gaussian', 11);

	t.equal(fspecial3.height, 3);
	t.equal(fspecial3.width, 3);
	t.equal(round(fspecial3.data[0]), 0.095);
	t.equal(round(fspecial3.data[1 * fspecial3.width + 1]), 0.148);

	t.equal(fspecial11.height, 11);
	t.equal(fspecial11.width, 11);
	t.equal(round(fspecial11.data[0]), 0);
	t.equal(round(fspecial11.data[0 * fspecial11.width + 1]), 0);
	t.equal(round(fspecial11.data[5 * fspecial11.width + 5]), 0.071);

	t.end();
});
