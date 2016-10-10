const test = require('blue-tape');
const { fspecial } = require('../../../src/matlab/fspecial');
const { round } = require('../../helpers/round');

test('should create a gaussian low pass filter of different dimensions', (t) => {
	const fspecial3 = fspecial('gaussian', 3);
	const fspecial11 = fspecial('gaussian', 11);

	t.equal(fspecial3.length, 3);
	t.equal(fspecial3[0].length, 3);
	t.equal(round(fspecial3[0][0]), 0.095);
	t.equal(round(fspecial3[1][1]), 0.148);

	t.equal(fspecial11.length, 11);
	t.equal(fspecial11[0].length, 11);
	t.equal(round(fspecial11[0][0]), 0);
	t.equal(round(fspecial11[0][1]), 0);
	t.equal(round(fspecial11[5][5]), 0.071);

	t.end();
});
