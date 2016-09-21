const test = require('blue-tape');
const w = require('../src/window');

const mx = [
	[11, 12, 13, 14],
	[15, 16, 17, 18],
	[19, 20, 21, 22],
	[23, 24, 25, 26]
];

test('should retrieve a subwindow from a matrix (getWindow)', (t) => {
	const out = w.getWindow(mx, 0, 1, 0, 1);

	t.equal(out.length, 1);
	t.equal(out[0].length, 1);
	t.equal(out[0][0], 11);
	t.end();
});

test('should retrieve a subwindow of any size with any offset (getWindow)', (t) => {
	const out = w.getWindow(mx, 0, 2, 2, 1);

	t.equal(out.length, 2);
	t.equal(out[0].length, 1);
	t.equal(out[0][0], 19);
	t.equal(out[1][0], 23);
	t.end();
});
