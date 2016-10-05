const test = require('blue-tape');
const { force } = require('../src/util');

test('should throw when used as a fallback and a parameter is omitted', (t) => {
	function teatime(teapot, tealeaves = force('tealeaves'), hotwater = force('hotwater')) {
		teapot = tealeaves + hotwater;
		return teapot;
	}

	t.throws(teatime);
	t.end();
});
