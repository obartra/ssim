const test = require('blue-tape');
const { force, getLimitDimensions } = require('../../src/util');

test('should throw when used as a fallback and a parameter is omitted', (t) => {
	function teatime(teapot, tealeaves = force('tealeaves'), hotwater = force('hotwater')) {
		teapot = tealeaves + hotwater;
		return teapot;
	}

	t.throws(teatime);
	t.end();
});

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
