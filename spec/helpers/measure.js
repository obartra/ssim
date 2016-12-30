/* eslint-disable no-console */
const Benchmark = require('benchmark');

function measure(t, testName, defer, fast, slow) {
	const results = {};
	const suite = new Benchmark.Suite(testName, {
		defer,
		onError,
		async: defer,
		onComplete,
		onCycle
	});

	suite.add(fast.name, {
		defer,
		fn: fast.fn
	});

	suite.add(slow.name, {
		defer,
		fn: slow.fn
	});

	suite.run({
		defer,
		async: defer
	});

	function onComplete() {
		const fastest = this.filter('fastest').map('name');
		const slowest = this.filter('slowest').map('name');

		Object.keys(results).forEach((name) => {
			const { rme, hz } = results[name];
			let icon = '';

			if (fastest.includes(name)) {
				icon = '🏍';
			} else if (slowest.includes(name)) {
				icon = '🐌';
			}
			console.log(`  - ${name}: ${hz} ops/sec ±${rme}% ${icon}`);
		});

		if (fastest.includes(fast.name) && slowest.includes(slow.name)) {
			t.ok(`${fast.name} is significantly faster than ${slow.name}`);
		} else {
			t.fail(`No statistical significance between ${fast.name} and ${slow.name}`);
		}
		t.end();
	}

	function onCycle({ target }) {
		results[target.name] = {
			rme: Math.round(target.stats.rme),
			count: target.count,
			hz: target.hz.toFixed(2)
		};
	}

	function onError() {
		t.fail('Tests failed');
	}
}

module.exports = measure;
