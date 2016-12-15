tapeDom.installCSS();
tapeDom.stream(tape);

const { roundTo } = require('../helpers/round');
const runSharedTests = require('../shared');
const LIVEfountain = require('../samples/LIVE.json')[0].mssim;
const Q_02876 = require('../samples/lena.json')['Q_02876.gif'];

const samples = {
	'3x3': '../samples/3x3.jpg',
	lena: '../samples/lena/Q.gif'
};

const start = new Date().getTime();
const tol = 10 ** -5; // 0.00001, to account for rounding differences on the 6th decimal
const timeout = 10; // 10 sec per test max
let created = 0;
let success = 0;
let failure = 0;
const scores = [{
	reference: '../samples/LIVE/refimgs/coinsinfountain.bmp',
	file: '../samples/LIVE/fastfading/img1.bmp',
	mssim: LIVEfountain,
	name: 'LIVE dataset fast fading test img1 vs coinsinfountain',
	options: {}
}, {
	reference: '../samples/LIVE/refimgs/coinsinfountain.bmp',
	file: '../samples/LIVE/fastfading/img1.bmp',
	mssim: LIVEfountain,
	name: 'LIVE dataset when using the original algorithm',
	options: {
		ssim: 'original'
	}
}, {
	reference: '../samples/lena/Q.gif',
	file: '../samples/lena/Q_02876.gif',
	mssim: Q_02876,
	name: 'low resulution lena comparison (gif test)',
	options: {}
}];
const totalTests = scores.length + 1; // all shared tests count as 1

function createTest({ file, reference, mssim, name, options }) {
	created++;
	tape(`should get a mssim of ${mssim} for ${name}`, (t) => {
		try {
			loadImage(reference, file, `Compares ${reference} vs ${file}`, () => {
				ssim(file, reference, options).then(({ mssim: computedMssim }) => {
					const fcomputed = roundTo(computedMssim, 5);
					const freference = roundTo(parseFloat(mssim), 5);
					const diff = roundTo(Math.abs(fcomputed - freference), 5);
					const testOk = diff - tol <= 0;

					increaseCounters(testOk);
					return t.equal(testOk, true, `expected ${freference}, got ${fcomputed} (${diff}/${tol})`);
				})
				.catch(t.fail)
				.then(t.end);
			});
		} catch (e) {
			failure++;
			t.fail(e);
			t.end();
		}
	});
}

function increaseCounters(testOk) {
	if (testOk) {
		success++;
	} else {
		failure++;
	}
}

function loadImage(ref, target, name, callback) {
	const refImg = new Image();
	const targetImg = new Image();
	const description = document.createElement('p');
	const container = document.createElement('div');
	let counter = 0;

	function onLoadImg() {
		if (++counter === 2) {
			callback();
		}
	}

	refImg.onload = onLoadImg;
	refImg.onerror = onLoadImg;
	targetImg.onload = onLoadImg;
	targetImg.onerror = onLoadImg;

	refImg.src = ref;
	targetImg.src = target;
	description.innerText = name;
	container.className = 'img-container';
	container.appendChild(refImg);
	container.appendChild(targetImg);
	container.appendChild(description);

	document
		.getElementById('images')
		.appendChild(container);
}

function onDone(ok, info) {
	clearTimeout(time);
	clearInterval(interv);

	const el = document.getElementById('test-results');
	const total = new Date().getTime() - start;
	const totalSec = parseInt(total / 1000 || 0, 10);
	const average = parseInt(total / scores.length || 0, 10);
	const msg = info || (ok ? 'All Good' : 'Tests failed');

	el.innerText = `
	Test completed in ${totalSec}s with an average of ${average}ms per test.
	Results: ${ok ? '✔️' : '❌'}
	Message: ${msg}
	`;

	if (ok) {
		el.className = 'complete all-good';
	} else {
		el.className = 'complete oh-my';
	}
}

for (let i = 0; i < scores.length; i++) {
	createTest(scores[i]);
}

runSharedTests(ssim, samples)
	.then(() => increaseCounters(true))
	.catch(() => increaseCounters(false));

const interv = setInterval(() => {
	if (failure) {
		onDone(false);
	} else if (success === created) {
		onDone(true);
	}
}, 500);

const time = setTimeout(() => {
	onDone(false, 'tests timed out');
}, timeout * totalTests * 1000);

console.log(`
Running: ${totalTests + 1} tests
timeout will occur in ${timeout * totalTests} seconds
`);
