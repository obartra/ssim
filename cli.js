#!/usr/bin/env node

const yargs = require('yargs');
const ssim = require('./dist/ssim');
const { version } = require('./version.js');

const name = 'ssim';
const argv = yargs
	.usage(`Usage: ${name} img1 img2 [options]`)
	.example(`${name} img1.png img2.png`)
	.example(`${name} img1.png img2.png --quiet`)
	.example(`${name} img1.png img2.png --threshold 0.95`)
	.example(`${name} img1.png img2.png --algorithm bezkrovny`)
	.example(`${name} https://url.jpg https://url2.jpg`)
	.nargs('threshold', 1)
	.number('threshold')
	.alias('t', 'threshold')
	.describe('threshold', 'exit 0 if mssim >= threshold, exit 1 otherwise')
	.nargs('algorithm', 1)
	.alias('a', 'algorithm')
	.describe('algorithm', 'SSIM algorithm to use: fast/original/bezkrovny')
	.default('algorithm', 'fast')
	.nargs('quiet', 0)
	.alias('q', 'quiet')
	.describe('quiet', 'Prints only the mean ssim value')
	.default('quiet', false)
	.demand(2)
	.help()
	.strict()
	.wrap(100)
	.version(version)
	.epilogue('For more information, check the wiki at https://github.com/obartra/ssim/wiki/CLI')
	.argv;

function threshold(value, limit, quiet) {
	if (value >= limit) {
		log(`SSIM value of ${value.toPrecision(4)} is above the threshold ${limit}. Success!`, quiet);
		process.exit(0);
	} else {
		log(`Error, SSIM value of ${value.toPrecision(4)} not above the threshold ${limit}.`, quiet);
		process.exit(1);
	}
}

function defaultOutput(value, performance, quiet) {
	if (quiet) {
		log(value.toPrecision(4));
	} else {
		log(`SSIM: ${value.toPrecision(4)} (${performance}ms)`);
	}
}

function log(msg, quiet = false) {
	if (!quiet) {
		process.stdout.write(`${msg}\n`);
	}
}

function validate() {
	if (typeof argv.threshold === 'undefined') {
		delete argv.threshold;
	} else if (isNaN(argv.threshold) || argv.threshold > 1 || argv.threshold < 0) {
		log('Parameter `threshold` must be a valid number within the [0, 1] range');
		yargs.showHelp();
		return false;
	}
	return true;
}

function onComplete({ mssim, performance }) {
	if (typeof argv.threshold !== 'undefined') {
		return threshold(mssim, argv.threshold, argv.quiet);
	}
	return defaultOutput(mssim, performance, argv.quiet);
}

function onError(error) {
	log('Oops something went wrong 😓');
	log(error.stack);
	return error;
}

if (validate()) {
	ssim(argv._[0], argv._[1], { ssim: argv.algorithm })
		.then(onComplete)
		.catch(onError);
} else {
	process.exit(1);
}
