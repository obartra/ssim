const browserList = require('./desiredCapabilities.json');
const httpServer = require('http-server');
const ngrok = require('ngrok');
const webdriverio = require('webdriverio');
const SauceLabs = require('saucelabs');

let testsCompleted = 0;
const httpPort = 8080;
const maxTests = 5;
const maxTestTime = 60;
const options = {
	selenium: {
		install: {},
		start: {
			args: [],
			doctor: true
		}
	},
	saucelabs: {
		username: process.env.SAUCE_USERNAME,
		password: process.env.SAUCE_ACCESS_KEY
	},
	webdriver: {
		user: process.env.SAUCE_USERNAME,
		key: process.env.SAUCE_ACCESS_KEY,
		host: 'ondemand.saucelabs.com',
		port: 80
	}
};

function startServer(port, ops = {}) {
	const server = httpServer.createServer(ops);

	return new Promise((resolve, reject) => {
		server.listen(port, () => {
			ngrok.connect(port, (err, url) => {
				if (err) {
					reject(err);
				} else {
					console.log(`Web server ready at ${url}`);
					resolve(url);
				}
			});
		});
	});
}

function startSauceLabs(ops = {}) {
	return Promise.resolve(new SauceLabs(ops));
}

function runTests(ops, saucelabs, url, browser) {
	const name = browser.name;

	ops.desiredCapabilities = browser;
	console.log('Starting tests for ', name);

	const client = webdriverio.remote(ops);

	client.addCommand('sauceJobStatus', (status, done) =>
		saucelabs.updateJob(client.requestHandler.sessionID, status, done)
	);

	return client
		.init()
		.url(`${url}/spec/web/index.html`)
		.waitForVisible('#test-results.complete', maxTests * maxTestTime * 1000)
		.getAttribute('#test-results.complete', 'class')
		.then(onClassFound)
		.then((passed) => {
			client
				.sauceJobStatus({
					passed,
					public: true
				})
				.end();
			return passed;
		})
		.then(passed => timeout(passed, 1000))
		.then(passed => onComplete(passed, `Completed tests for ${name} (${passed ? '✔️' : '❌'})`))
		.catch(err => onComplete(false, err));
}

function timeout(pass, delay) {
	return new Promise(resolve => setTimeout(() => resolve(pass), delay));
}

function onClassFound(classNames) {
	if (classNames instanceof Array) {
		classNames = classNames.join(' ');
	}
	return classNames.split(' ').indexOf('all-good') !== -1;
}

function onComplete(passed, msg) {
	if (!passed) {
		console.error('Oops, tests failed');
		console.error(msg);
		ngrok.kill();
		process.exit(1);
	} else if (++testsCompleted === browserList.length) {
		console.log(msg);
		console.log('All tests completed successfully');
		ngrok.kill();
		process.exit(0);
	} else {
		console.log(msg);
	}
}

Promise.all([
	startServer(httpPort),
	startSauceLabs(options.saucelabs)
])
.then(([url, saucelabs]) =>
	Promise.all(
		browserList.map(browser =>
			runTests(options.webdriver, saucelabs, url, browser)
		)
	)
)
.catch(err => onComplete(false, err));

