const options = require('../../src/defaults.json');
const test = require('blue-tape');
const { flatMxToData } = require('../helpers/util');
const { loadCsv } = require('../helpers/sampleloader');
const { mean2d } = require('../../src/math');
const { originalSsim } = require('../../src/originalSsim');
const { bezkrovnySsim } = require('../../src/bezkrovnySsim');
const { roundTo } = require('../helpers/round');
const { ssim: fastSsim } = require('../../src/ssim');
let samples = require('../helpers/imageSamples.json');

const k0Options = Object.assign({}, options, {
	k1: 0,
	k2: 0
});
const sampleCsv = loadCsv({
	lena: './samples/lena/q1.csv',
	lena02876: './samples/lena/q02876.csv'
});

function areAllOne(data) {
	return !data.some(datum => datum !== 1);
}

samples = JSON.parse(JSON.stringify(samples));

Object.keys(samples).forEach((key) => {
	Object.keys(samples[key]).forEach((skey) => {
		samples[key][skey] = flatMxToData(samples[key][skey]);
	});
});
Object.keys(sampleCsv).forEach((key) => {
	sampleCsv[key] = flatMxToData(sampleCsv[key]);
});

[fastSsim, originalSsim, bezkrovnySsim].forEach((ssim) => {
	test('should return 1 for equal data', (t) => {
		const A = samples['24x18'].gray;
		const ssimMap = ssim(A, A, options);

		t.equal(areAllOne(ssimMap.data), true);
		t.end();
	});

	test('should return 1 when k1 and k2 are 0', (t) => {
		const A = samples['24x18'].gray;
		const ssimMap = ssim(A, A, k0Options);

		t.equal(areAllOne(ssimMap.data), true);
		t.end();
	});
});

[fastSsim, originalSsim].forEach((ssim) => {
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

	test('UQI should match script results', (t) => {
		const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, k0Options);
		const uqiOut = roundTo(mean2d(uqiMap), 5);

		t.equal(uqiOut, 0.2392);
		t.end();
	});
});
