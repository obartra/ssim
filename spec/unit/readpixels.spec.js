const test = require('blue-tape');
const fs = require('fs');
const { join } = require('path');
const { readpixels } = require('../../src/readpixels.js');
const { loadImages } = require('../helpers/sampleloader');
const { imageDataToMx } = require('../helpers/util');

// the gradient image is 6px wide, 4px tall RGBA with no transparency
const gradientData = [
	[[2, 183, 8, 255], [158, 59, 0, 255], [64, 173, 4, 255], [13, 248, 0, 255], [224, 154, 0, 255],
		[165, 237, 5, 255]],
	[[9, 159, 2, 255], [206, 36, 0, 255], [129, 143, 8, 255], [57, 235, 0, 255], [253, 122, 0, 255],
		[220, 220, 8, 255]],
	[[29, 120, 0, 255], [0, 228, 8, 255], [198, 106, 7, 255], [113, 212, 0, 255], [42, 255, 0, 255],
		[247, 192, 1, 255]],
	[[86, 90, 0, 255], [22, 207, 7, 255], [242, 76, 2, 255], [176, 188, 4, 255], [99, 252, 3, 255],
		[255, 164, 0, 255]]
];

const baseURL = 'https://raw.githubusercontent.com/obartra/ssim/master';
const paths = {
	lena: './samples/lena/color.jpg',
	gradientJPG: './samples/gradient.jpg',
	gradientPNG: './samples/gradient.png',
	gradientGIF: './samples/gradient.gif',
	gradientBMP: './samples/gradient.bmp',
	bit1: './samples/bitdepth/1_bit.png',
	bit2: './samples/bitdepth/2_bit.png',
	bit4: './samples/bitdepth/4_bit.png',
	bit8: './samples/bitdepth/8_bit.png',
	bit24: './samples/bitdepth/24_bit.png'
};
const loaded = loadImages(paths);

test('should read image dimensions correctly', t =>
	readpixels('./spec/samples/lena/color.jpg', Promise)
		.then((pixels) => {
			t.equals(pixels.width, 512);
			t.equals(pixels.height, 512);
		})
);

test('should downsize images when a limit parameter is specified', t =>
	readpixels('./spec/samples/lena/color.jpg', Promise, 100)
		.then(pixels => t.equal(Math.min(pixels.width, pixels.height), 100))
);

test('should limit size to "limit" on the smallest axis', t =>
	Promise.all([
		readpixels('./spec/samples/aspectratio/8.jpg', Promise, 10) // wide
			.then(pixels => t.equal(pixels.height, 10)),
		readpixels('./spec/samples/aspectratio/4.jpg', Promise, 10) // tall
			.then(pixels => t.equal(pixels.width, 10))
	])
);

test('should be able to read from a buffer', (t) => {
	const buffer = fs.readFileSync(join(__dirname, '../samples/gradient.png'));

	return readpixels(buffer, Promise)
		.then(imageDataToMx)
		.then(img => t.deepEqual(img, gradientData));
});

test('should be able to retrieve a JPG image from a URL', (t) => {
	const url = `${baseURL}/spec/samples/gradient.jpg`;

	return readpixels(url, Promise)
		.then(imageDataToMx)
		.then(img => t.deepEqual(img, gradientData));
});

test('should be able to retrieve a PNG image from a URL', (t) => {
	const url = `${baseURL}/spec/samples/gradient.png`;

	return readpixels(url, Promise)
		.then(imageDataToMx)
		.then(img => t.deepEqual(img, gradientData));
});

test('should be able to retrieve a GIF image from a URL', (t) => {
	const url = `${baseURL}/spec/samples/gradient.gif`;

	return readpixels(url, Promise)
		.then(imageDataToMx)
		.then(img => t.deepEqual(img, gradientData));
});

test('should be able to retrieve a BMP image from a URL', (t) => {
	const url = `${baseURL}/spec/samples/gradient.bmp`;

	return readpixels(url, Promise)
		.then(imageDataToMx)
		.then(img => t.deepEqual(img, gradientData));
});

test('should throw if trying to retrieve an invalid URL', t =>
	readpixels('fakeurl.com/image1.png', Promise)
		.then(() => t.fail('Should have thrown an error'))
		.catch(t.ok)
);

test('should correctly read JPG data', t => loaded.then(pixels =>
	t.deepEqual(pixels.gradientJPG, gradientData)
));

test('should correctly read PNG data', t => loaded.then(pixels =>
	t.deepEqual(pixels.gradientPNG, gradientData)
));

test('should correctly read GIF data', t => loaded.then(pixels =>
	t.deepEqual(pixels.gradientGIF, gradientData)
));

test('should correctly read BMP data', t => loaded.then(pixels =>
	t.deepEqual(pixels.gradientBMP, gradientData)
));

function maxPixel(data) {
	return data.reduce((accx, currentx) =>
		Math.max(accx, currentx.reduce((accy, curry) => Math.max(...curry), 0))
	, 0);
}

test('should normalize 1bit data to 8', t => loaded.then(pixels =>
	t.equal(maxPixel(pixels.bit1), 255)
));

test('should normalize 2bit data to 8', t => loaded.then(pixels =>
	t.equal(maxPixel(pixels.bit2), 255)
));

test('should normalize 4bit data to 8', t => loaded.then(pixels =>
	t.equal(maxPixel(pixels.bit4), 255)
));

test('should keep 8bit data at 8 bits', t => loaded.then(pixels =>
	t.equal(maxPixel(pixels.bit8), 255)
));

test('should normalize 24bit data to 8', t => loaded.then(pixels =>
	t.equal(maxPixel(pixels.bit24), 255)
));
