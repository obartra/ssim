const test = require('blue-tape');
const w = require('../src/window');

const noop = () => null;

test('should return 1 window when the window size matches the dimensions size', (t) => {
	const pixels = { test: 'a', shape: [10, 10, 1] };
	const ws = w.getWindows(pixels, noop, 10, 2);

	t.equal(ws.length, 1);
	t.end();
});

test('should return 1 window when the window size is bigger than the dimensions size', (t) => {
	const pixels = { test: 'a', shape: [10, 10, 1] };
	const ws = w.getWindows(pixels, noop, 1000, 2);

	t.equal(ws.length, 1);
	t.end();
});

test('should return 4 when the window size is one pixel shorter than the dimensions and step is 1',
(t) => {
	const pixels = { test: 'a', shape: [100, 100, 1] };
	const ws = w.getWindows(pixels, noop, 99, 1);

	t.equal(ws.length, 4);
	t.end();
});

test('should return 4 when the window size is x pixels shorter than the dimensions and step is x',
(t) => {
	const x = 5;
	const windowSize = 100;
	const pixels = { test: 'a', shape: [windowSize, windowSize, 1] };
	const ws = w.getWindows(pixels, noop, windowSize - x, x);

	t.equal(ws.length, 4);
	t.end();
});

test('should return all pixels when step size is 1 and window size is 1', (t) => {
	const pixels = { test: 'a', shape: [2, 2, 1] };
	const ws = w.getWindows(pixels, noop, 1, 1);

	t.equal(ws.length, 4);
	t.end();
});

test('should return all windows when step size is 1 and window is > 1', (t) => {
	const pixels = { test: 'a', shape: [3, 6, 1] };
	const ws = w.getWindows(pixels, noop, 2, 1);

	t.equal(ws.length, 10);
	t.end();
});

test('should return a quarter (1/2 * 1/2) of the windows when step size is 2', (t) => {
	const pixels = { test: 'a', shape: [10, 10, 1] };
	const ws1 = w.getWindows(pixels, noop, 1, 1);
	const ws2 = w.getWindows(pixels, noop, 1, 2);

	t.equal(ws1.length, 100);
	t.equal(ws2.length, 25);
	t.end();
});

test('should skip pixels if windows wouldn\'t be full size', (t) => {
	const pixels = { test: 'a', shape: [17, 33, 1] };
	const pixelsSame = { test: 'a', shape: [16, 32, 1] };
	const pixelsAbove = { test: 'a', shape: [20, 36, 1] };
	const windowSize = 8;

	// [17, 33] becomes [8, 24] since these are the closest values that can accomodate +4 +8 offset
	// but [20, 36] can already fit the next index so it has more windows

	const ws1 = w.getWindows(pixels, noop, windowSize, 4);
	const ws2 = w.getWindows(pixelsSame, noop, windowSize, 4);
	const ws3 = w.getWindows(pixelsAbove, noop, windowSize, 4);

	t.equal(ws1.length, 21);
	t.equal(ws2.length, 21);
	t.equal(ws3.length, 32);
	t.end();
});
