#!/usr/bin/env node

const yargs = require('yargs');
const ssim = require('./dist/ssim');
const { version } = require('./version.js');

const argv = yargs
	.usage('$0 ssim <img> <img> - Compares 2 images (img can be a URL or a filepath)')
	.example('ssim img1.png img2.png')
	.example('ssim https://url.jpg https://url2.jpg')
	.demand(2)
	.help()
	.wrap(100)
	.version(version)
	.argv;

ssim(argv._[0], argv._[1])
	.then(({ mssim, performance }) => {
		process.stdout.write(`SSIM: ${mssim.toPrecision(4)} (${performance}ms)\n`);
	})
	.catch((error) => {
		process.stdout.write(`Oops something went wrong 😓 ${error.stack}\n`);
	});
