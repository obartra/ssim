tapeDom.installCSS();
tapeDom.stream(tape);

const { roundTo } = require('../helpers/round');
const scores = require('../samples/LIVE.json');

const start = new Date().getTime();
const tol = 10 ** -5; // 0.00001, to account for rounding differences on the 6th decimal
const base = 'samples/LIVE';
const timeout = 1; // 1 sec per test max
const totalTests = Math.min(5, scores.length); // Only run 5 tests by now until improved perf
let created = 0;
let success = 0;
let failure = 0;

function createTest({ file, reference, mssim, type }) {
	created++;
	tape(`should get a mssim of ${mssim} for ${file}/${reference} (${type})`, (t) => {
		const refPath = `../${base}/refimgs/${reference}`;
		const filePath = `../${base}/${type}/${file}`;

		try {
			ssim(refPath, filePath).then(({ mssim: computedMssim }) => {
				const fcomputed = roundTo(computedMssim, 5);
				const freference = roundTo(parseFloat(mssim), 5);
				const diff = roundTo(Math.abs(fcomputed - freference), 5);

				const testOk = diff - tol <= 0;

				if (testOk) {
					success++;
				} else {
					failure++;
				}
				return t.equal(testOk, true, `expected ${fcomputed}, got ${freference} (${diff}/${tol})`);
			})
			.catch(t.fail)
			.then(t.end);
		} catch (e) {
			failure++;
			t.fail(e);
			t.end();
		}
	});
}

for (let i = 0; i < totalTests; i++) {
	createTest(scores[i]);
}

function onDone(ok, info) {
	clearTimeout(time);
	clearInterval(interv);

	const el = document.getElementById('test-results');
	const total = new Date().getTime() - start;
	const totalSec = parseInt(total / 1000 || 0, 10);
	const average = parseInt(total / totalTests || 0, 10);
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

const interv = setInterval(() => {
	if (failure) {
		onDone(false);
	} else if (success === created) {
		onDone(true);
	}
}, 500);

const time = setTimeout(() => {
	onDone(false, 'tests timed out');
}, timeout * scores.length * 1000);

console.log(`
Running: ${scores.length} tests
timeout will occur in ${timeout * scores.length} seconds
`);
