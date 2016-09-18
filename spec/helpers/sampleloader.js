const { join } = require('path');
const { readpixels } = require('../../src/readpixels');

module.exports = function loadSamples(samples) {
	const testPath = join(__dirname, '../');
	const promises = Object.keys(samples)
		.map(key =>
			readpixels(join(testPath, samples[key]))
				.then(pixels => ({ [key]: pixels })
			)
		);

	return Promise.all(promises).then(values => Object.assign(...values));
};
