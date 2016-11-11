const test = require('blue-tape');
const { exec } = require('child_process');

test('should be a function', (t) => {
	exec('./cli.js ./spec/samples/lena/Q_09372.gif ./spec/samples/lena/color.jpg',
	(err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stderr, '');
		t.equal(stdout.indexOf('SSIM: 0.3006'), 0, stdout);
		t.end();
	});
});

