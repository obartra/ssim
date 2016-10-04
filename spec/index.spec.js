const test = require('blue-tape');
const index = require('../index');
const { join } = require('path');

const samples = {
	'3x3': join(__dirname, './samples/3x3.jpg'),
	e1: join(__dirname, './samples/einstein/Q1.gif'),
	e0913: join(__dirname, './samples/einstein/Q0913.gif'),
	e0988: join(__dirname, './samples/einstein/Q0988.gif'),
	lena1: join(__dirname, './samples/lena/Q1.gif'),
	lena02876: join(__dirname, './samples/lena/Q02876.gif'),
	lena03461: join(__dirname, './samples/lena/Q03461.gif'),
	lena03891: join(__dirname, './samples/lena/Q03891.gif'),
	lena04408: join(__dirname, './samples/lena/Q04408.gif'),
	lena06494: join(__dirname, './samples/lena/Q06494.gif'),
	lena09372: join(__dirname, './samples/lena/Q09372.gif'),
	lena09894: join(__dirname, './samples/lena/Q09894.gif'),
	barba1: join(__dirname, './samples/IVC/barba/barba.bmp'),
	barbaj2kr1: join(__dirname, './samples/IVC/barba/barba_j2000_r1.bmp'),
	barbaj2kr2: join(__dirname, './samples/IVC/barba/barba_j2000_r2.bmp'),
	barbaj2kr3: join(__dirname, './samples/IVC/barba/barba_j2000_r3.bmp'),
	barbaj2kr4: join(__dirname, './samples/IVC/barba/barba_j2000_r4.bmp'),
	barbaj2kr5: join(__dirname, './samples/IVC/barba/barba_j2000_r5.bmp')
};

test('Missing image parameters', (t) => {
	t.throws(() => index(), 'Should throw if missing both image parameters');
	t.throws(() => index('path1'), 'Should throw if missing first image parameters');
	t.throws(() => index(undefined, 'path2'), 'Should throw if missing second image parameters');
	t.end();
});

test('Invalid options', (t) => {
	t.throws(() => index('1', '2', { apples: 3 }), 'Should throw if passing invalid parameter');
	t.throws(() => index('1', '2', { k1: -4 }), 'Should throw if k1 is < 0');
	t.throws(() => index('1', '2', { k2: -0.4 }), 'Should throw if k2 is < 0');
	t.end();
});

test('Different dimensions', t =>
	index(samples['3x3'], samples.e1)
		.then(() => t.fail('Should have failed promise for different size images'))
		.catch(t.ok)
);

// IMG TOO SMALL
// test('should produce a SSIM of 1 when compared with itself (3x3)', t =>
// 	index(samples['3x3'], samples['3x3']).then(mssim => t.equal(mssim, 1))
// );

test('should produce a SSIM of 1 when compared with itself (lena)', t =>
	index(samples.lena1, samples.lena1).then(mssim => t.equal(mssim, 1))
);

// test('should produce a SSIM of 0.2876 (lena)', t =>
// 	index(samples.lena1, samples.lena02876).then(mssim => t.equal(mssim, 0.2876))
// );

// test('should produce a SSIM of 0.3461 (lena)', t =>
// 	index(samples.lena1, samples.lena03461).then(mssim => t.equal(mssim, 0.3461))
// );

// test('should produce a SSIM of 0.3891 (lena)', t =>
// 	index(samples.lena1, samples.lena03891).then(mssim => t.equal(mssim, 0.3891))
// );

// test('should produce a SSIM of 0.4408 (lena)', t =>
// 	index(samples.lena1, samples.lena04408).then(mssim => t.equal(mssim, 0.4408))
// );

// test('should produce a SSIM of 0.6494 (lena)', t =>
// 	index(samples.lena1, samples.lena06494).then(mssim => t.equal(mssim, 0.6494))
// );

// test('should produce a SSIM of 0.9372 (lena)', t =>
// 	index(samples.lena1, samples.lena09372).then(mssim => t.equal(mssim, 0.9372))
// );

// test('should produce a SSIM of 0.9894 (lena)', t =>
// 	index(samples.lena1, samples.lena09894).then(mssim => t.equal(mssim, 0.9894))
// );

// test('should correctly compute a SSIM of 0.913 for einstein/Q0913.gif reference image', t =>
// 	index(samples.e1, samples.e0913, { step: 1 }).then(mssim => t.equal(mssim, 0.913))
// );

// test('should correctly compute a SSIM of 0.913 for einstein/Q0913.gif reference image', t =>
// 	index(samples.e1, samples.e0913, { step: 1 }).then(mssim => t.equal(mssim, 0.913))
// );

// test('should correctly compute a SSIM of 0.98093 for barba/r1.bmp reference image', t =>
// 	index(samples.e1, samples.e0913, { step: 1 }).then(mssim => t.equal(mssim, 0.98093))
// );
// 	barba1: join(__dirname, './samples/IVC/barba/barba.bmp'),
// 	barbaj2kr1: join(__dirname, './samples/IVC/barba/barba_j2000_r1.bmp'),
// 	barbaj2kr2: join(__dirname, './samples/IVC/barba/barba_j2000_r2.bmp'),
// 	barbaj2kr3: join(__dirname, './samples/IVC/barba/barba_j2000_r3.bmp'),
// 	barbaj2kr4: join(__dirname, './samples/IVC/barba/barba_j2000_r4.bmp'),
// 	barbaj2kr5: join(__dirname, './samples/IVC/barba/barba_j2000_r5.bmp')
// | avion.bmp  | avion_j2000_r1.bmp	| 0.97873	| 0.97914	| -0.041%	| 0.81627	|
// | avion.bmp  | avion_j2000_r2.bmp	| 0.95488	| 0.95530	| -0.042%	| 0.72424	|
// | avion.bmp  | avion_j2000_r3.bmp	| 0.92741	| 0.92811	| -0.070%	| 0.64121	|
// | avion.bmp  | avion_j2000_r4.bmp	| 0.91484	| 0.91540	| -0.056%	| 0.61956	|
// | avion.bmp  | avion_j2000_r5.bmp	| 0.86476	| 0.86559	| -0.083%	| 0.52559	|
// | barba.bmp  | barba_j2000_r1.bmp	| 0.98056	| 0.98093	| -0.037%	| 0.92156	|
// | barba.bmp  | barba_j2000_r1.bmp	| 0.96216	| 0.96240	| -0.024%	| 0.88579	|
// | barba.bmp  | barba_j2000_r1.bmp	| 0.92613	| 0.92634	| -0.021%	| 0.82417	|
// | barba.bmp  | barba_j2000_r1.bmp	| 0.88115	| 0.88208	| -0.093%	| 0.76101	|
// | barba.bmp  | barba_j2000_r1.bmp	| 0.77239	| 0.77164	| +0.075%	| 0.61380	|
// | boats.bmp  | boats_j2000_r1.bmp	| 0.98386	| 0.97541	| +0.845%	| 0.82059	|
// | boats.bmp  | boats_j2000_r2.bmp	| 0.95965	| 0.95624	| +0.341%	| 0.77137	|
// | boats.bmp  | boats_j2000_r3.bmp	| 0.94605	| 0.92346	| +2.259%	| 0.70380	|
// | boats.bmp  | boats_j2000_r4.bmp	| 0.90338	| 0.89287	| +1.051%	| 0.65141	|
// | boats.bmp  | boats_j2000_r5.bmp	| 0.82841	| 0.82815	| +0.026%	| 0.54581	|
