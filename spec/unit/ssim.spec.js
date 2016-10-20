const test = require('blue-tape');
const { ssim: fastSsim } = require('../../src/ssim');
const { originalSsim } = require('../../src/originalSsim');
const { mean2d } = require('../../src/math');
const options = require('../../src/defaults.json');
const { loadCsv } = require('../helpers/sampleloader');
const samples = require('../helpers/imageSamples.json');
const { roundTo } = require('../helpers/round');

const fullSampleOptions = Object.assign({}, options, {
	downsample: false
});
const k0Options = Object.assign({}, options, {
	k1: 0,
	k2: 0
});
const sampleCsv = loadCsv({
	lena: './samples/lena/q1.csv',
	lena02876: './samples/lena/q02876.csv'
});

function compareto1(ref) {
	this.equal(ref, 1);
}

[fastSsim, originalSsim].forEach((ssim) => {
	test('should return 1 for equal data', (t) => {
		const A = samples['24x18'].gray;
		const ssimMap = ssim(A, A, options);

		ssimMap.forEach(col => col.forEach(compareto1.bind(t)));
		t.end();
	});

	test('should also return one when k1 and k2 are 0', (t) => {
		const A = samples['24x18'].gray;
		const ssimMap = ssim(A, A, k0Options);

		ssimMap.forEach(col => col.forEach(compareto1.bind(t)));
		t.end();
	});

	test('should return same results than original script', (t) => {
		const A = samples['24x18'].gray;
		const B = samples['24x18-degraded'].gray;
		const ssimMap = ssim(A, B, options);

		t.equal(roundTo(mean2d(ssimMap), 5), 0.46275);
		t.end();
	});

	test('should return same results than original when k1 and k2 are 0', (t) => {
		const A = samples['24x18'].gray;
		const B = samples['24x18-degraded'].gray;
		const ssimMap = ssim(A, B, k0Options);

		t.equal(roundTo(mean2d(ssimMap), 5), 0.45166);
		t.end();
	});

	test('should downsample images and produce somewhat similar results', (t) => {
		const ssimMap = ssim(sampleCsv.lena, sampleCsv.lena02876, options);
		const fullSsimMap = ssim(sampleCsv.lena, sampleCsv.lena02876, fullSampleOptions);

		const out = roundTo(mean2d(ssimMap), 5);
		const fullOut = roundTo(mean2d(fullSsimMap), 5);

		t.equal(out, 0.76269);
		t.equal(fullOut, 0.67094);

		t.end();
	});

	test('UQI should match script results', (t) => {
		const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, k0Options);

		const uqiOut = roundTo(mean2d(uqiMap), 5);

		t.equal(uqiOut, 0.46544);
		t.end();
	});
});
