const getSSIM = require('./index.js');

getSSIM('./spec/samples/einstein1.gif', './spec/samples/einstein0840.gif').then(ssim =>
		process.stdout.write(`SSIM: ${ssim} DSSIM: ${1 - ssim}`)
	)
	.catch(err =>
		process.stdout.write('Error generating SSIM', err)
	);
