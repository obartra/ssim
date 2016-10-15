const { readFileSync, readdirSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const targetPath = resolve(__dirname, '../spec/samples/LIVE.json');

function csvToJSON([name, csv]) {
	return 	csv
		.split('\n')
		.map(line => line.split(','))
		.map(([reference, file, mssim, reportedMssim]) => ({
			file: `${file}.bmp`,
			mssim,
			reference,
			reportedMssim,
			type: name
		}));
}

const files = readdirSync('.')
	.filter(file => file.endsWith('.csv'))
	.map(file => [file.split('.')[0], resolve(__dirname, file)])
	.map(([name, path]) => [name, readFileSync(path)])
	.map(([name, buffer]) => [name, buffer.toString()])
	.map(csvToJSON);

const jsonContent = [].concat.apply([], files); // eslint-disable-line prefer-spread

writeFileSync(targetPath, JSON.stringify(jsonContent, undefined, '\t'));
