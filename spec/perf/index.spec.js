const test = require('blue-tape');
const { join } = require('path');
const index = require('../../index');

const samples = {
	'3x3': join(__dirname, '../samples/3x3.jpg'),
	lena: join(__dirname, '../samples/lena/Q.gif'),
	avion: join(__dirname, '../samples/IVC_SubQualityDB/color/avion.bmp'),
	avion_j2000_r1: join(__dirname, '../samples/IVC_SubQualityDB/color/avion_j2000_r1.bmp')
};

test('ssim should be faster than originalSsim', t =>
	index(samples.avion, samples.avion_j2000_r1, { ssim: 'fast' })
	.then(({ performance: fast }) => {
		index(samples.avion, samples.avion_j2000_r1, { ssim: 'original' })
		.then(({ performance: original }) => {
			t.equal(fast < original, true,
			`fast SSIM implementation must be faster than original (${fast}ms vs ${original}ms)`);
		})
		.catch(t.fail);
	})
);
