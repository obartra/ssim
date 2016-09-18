const test = require('blue-tape');
const fs = require('fs');
const { join } = require('path');
const ndarray = require('ndarray');
const { readpixels } = require('../src/readpixels.js');

const EXPECTED_IMAGE = ndarray([0, 0, 0, 255, 255, 0, 0, 255, 255, 255, 0, 255, 255, 0, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 0, 255, 0, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
	255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
	[16, 8, 4], [4, 64, 1]);

function testImage(t, img, tol) {
	t.equals(img.shape[0], 16);
	t.equals(img.shape[1], 8);

	for (let i = 0; i < 16; ++i) {
		for (let j = 0; j < 8; ++j) {
			for (let k = 0; k < 3; ++k) {
				if (tol) {
					t.ok(Math.abs(img.get(i, j, k) - EXPECTED_IMAGE.get(i, j, k)) < tol);
				} else {
					t.equals(img.get(i, j, k), EXPECTED_IMAGE.get(i, j, k));
				}
			}
		}
	}
}

test('should read image dimensions correctly', t =>
	readpixels('./spec/samples/readpixels/lena.png')
		.then(pixels => t.equals(pixels.shape.join(','), '512,512,4'))
);

test('should parse png', t =>
	readpixels('./spec/samples/readpixels/test_pattern.png').then(pixels => testImage(t, pixels))
);

test('should parse jpg', t =>
	readpixels('./spec/samples/readpixels/test_pattern.jpg').then(pixels => testImage(t, pixels, 4))
);

test('should parse gif', t =>
	readpixels('./spec/samples/readpixels/test_pattern.gif')
		.then(pixels => testImage(t, pixels.pick(0)))
);

test('should be able to read from a buffer', (t) => {
	const buffer = fs.readFileSync(join(__dirname, './samples/readpixels/test_pattern.png'));

	return readpixels(buffer, 'image/png').then(pixels => testImage(t, pixels));
});

test('should be able to retrieve a PNG image from a URL', (t) => {
	const url = 'https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.png';

	return readpixels(url)
		.then(pixels => testImage(t, pixels));
});

test('should be able to retrieve a GIF image from a URL', (t) => {
	const url = 'https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.gif';

	return readpixels(url)
		.then(pixels => testImage(t, pixels.pick(0)));
});
