const getSSIM = require('./index.js');

getSSIM('./spec/samples/einstein/Q1.gif', './spec/samples/einstein/Q0840.gif').then(mssim =>
		process.stdout.write(`MSSIM: ${mssim}`)
	)
	.catch(err =>
		process.stdout.write('Error generating MSSIM', err)
	);
