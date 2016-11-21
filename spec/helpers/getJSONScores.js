require('core-js/modules/es6.string.ends-with');

const { resolve, sep } = require('path');
const { readdirSync } = require('fs');

function filterFiles(file = '', extension) {
	return file.toLowerCase().endsWith(extension);
}

function fileToObjectPath(scores, path, fileName, extension) {
	let referenceFile = fileName.split(sep).pop().split('_')[0];

	if (!referenceFile.endsWith(`.${extension}`)) {
		referenceFile += `.${extension}`;
	}

	if (scores[fileName] === 0) {
		return {};
	}

	const reference = resolve(path, referenceFile);
	const file = resolve(path, fileName);

	return {
		[fileName]: {
			reference,
			file,
			mssim: scores[fileName] || 0
		}
	};
}

module.exports = function getJSONScores(scores, path, extension) {
	return Object.assign(...readdirSync(path)
		.filter(file => filterFiles(file, extension))
		.map(fileName => fileToObjectPath(scores, path, fileName, extension)));
};
