const options = require('../../src/defaults.json');
const test = require('blue-tape');
const { flatMxToData } = require('../helpers/util');
const { loadCsv } = require('../helpers/sampleloader');
const { mean2d } = require('../../src/math');
const { bezkrovnySsim: ssim } = require('../../src/bezkrovnySsim');
const { roundTo } = require('../helpers/round');
let samples = require('../helpers/imageSamples.json');

const k0Options = Object.assign({}, options, {
	k1: 0,
	k2: 0
});
const sampleCsv = loadCsv({
	lena: './samples/lena/q1.csv',
	lena02876: './samples/lena/q02876.csv'
});

samples = JSON.parse(JSON.stringify(samples));

Object.keys(samples).forEach((key) => {
	Object.keys(samples[key]).forEach((skey) => {
		samples[key][skey] = flatMxToData(samples[key][skey]);
	});
});
Object.keys(sampleCsv).forEach((key) => {
	sampleCsv[key] = flatMxToData(sampleCsv[key]);
});

test('should return same results than Bezkrovny\'s implementation', (t) => {
	const A = samples['24x18'].gray;
	const B = samples['24x18-degraded'].gray;
	const ssimMap = ssim(A, B, options);

	t.equal(roundTo(mean2d(ssimMap), 5), 0.86598);
	t.end();
});

test('should return same results than than Bezkrovny\'s implementation when k1 / k2 are 0', (t) => {
	const A = samples['24x18'].gray;
	const B = samples['24x18-degraded'].gray;
	const ssimMap = ssim(A, B, k0Options);

	t.equal(roundTo(mean2d(ssimMap), 5), 0.86284);
	t.end();
});

test('UQI should match Bezkrovny\'s implementation results', (t) => {
	const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, k0Options);

	t.equal(roundTo(mean2d(uqiMap), 5), 0.35528);
	t.end();
});
