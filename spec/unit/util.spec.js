const test = require('blue-tape');
const { getLimitDimensions } = require('../../src/util');

test('should enforce min dimensions when size exceeds them', (t) => {
	const out = getLimitDimensions(600, 300, 100);

	t.equal(out.height, 100);
	t.equal(out.width, 50);
	t.end();
});

test('should not enforce min dimensions when size is smaller', (t) => {
	const out = getLimitDimensions(60, 30, 100);

	t.equal(out.height, 30);
	t.equal(out.width, 60);
	t.end();
});
