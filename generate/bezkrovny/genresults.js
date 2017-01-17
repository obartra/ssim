const { readFileSync, writeFileSync } = require('fs');
const ssim = require('../../dist/ssim');
const { resolve } = require('path');

const imgPath = resolve(__dirname, '../../spec/samples/LIVE/');
// valid formats are *.json and *.dat
const targetPath = resolve(__dirname, './out.dat');
const outputFormat = targetPath.split('.').pop();

function genBezkrovnySSIM([name, csv], format) {
	return csv
		.split('\n')
		.map(line => line.split(','))
		.map(([reference, file, mssim, reportedMssim]) => {
			const refImg = resolve(imgPath, 'refimgs', reference);
			const targetImg = resolve(imgPath, name, `${file}.bmp`);

			return ssim(refImg, targetImg, { ssim: 'bezkrovny' })
				.then(({ mssim: bezkrovnyMssim }) => {
					bezkrovnyMssim = parseFloat(bezkrovnyMssim.toPrecision(5));

					if (format === 'dat') {
						return `${reference} ${name} ${file} ${mssim} ${reportedMssim} ${bezkrovnyMssim}`;
					}

					return {
						file: `${file}.bmp`,
						mssim,
						reference,
						bezkrovnyMssim,
						reportedMssim,
						type: name
					};
				});
		});
}

function accumulate(val, pre = [], format = 'dat') {
	process.stdout.write('.');
	return Promise.all(genBezkrovnySSIM(val, format)).then((resp) => {
		if (format === 'dat') {
			return `${pre}\n${resp.join('\n')}`;
		}
		return [...pre, ...resp];
	});
}

const files = ['jp2k', 'jpeg', 'wn', 'gblur', 'fastfading']
	.map(file => [file, resolve(__dirname, '..', `${file}.csv`)])
	.map(([name, path]) => [name, readFileSync(path)])
	.map(([name, buffer]) => [name, buffer.toString()]);

files.reduce((promise, val) =>
	promise.then(pre => accumulate(val, pre, outputFormat))
, Promise.resolve())
	.then((out) => {
		process.stdout.write(`\nSaving ${targetPath}...\n`);
		if (outputFormat === 'dat') {
			writeFileSync(targetPath, out.trim());
		} else {
			const jsonContent = [].concat.apply([], out); // eslint-disable-line prefer-spread

			writeFileSync(targetPath, JSON.stringify(jsonContent, undefined, '\t'));
		}
	});
