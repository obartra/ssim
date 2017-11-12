const browserList = require('./desiredCapabilities.json')
const httpServer = require('http-server')
const ngrok = require('ngrok')
const webdriverio = require('webdriverio')
const SauceLabs = require('saucelabs')

let testsCompleted = 0
const httpPort = 8080
const maxTestTime = Infinity

const maxRetries = 3
const isCIMaster = process.env.CI && process.env.CIRCLE_BRANCH === 'master'
const tags = [process.env.CIRCLE_BRANCH || 'dev']
const build = process.env.CIRCLE_BUILD_NUM || 0
const username = isCIMaster
  ? process.env.SAUCE_USERNAME_MASTER
  : process.env.SAUCE_USERNAME
const password = isCIMaster
  ? process.env.SAUCE_ACCESS_KEY_MASTER
  : process.env.SAUCE_ACCESS_KEY
const options = {
  selenium: {
    install: {},
    start: {
      args: [],
      doctor: true,
    },
  },
  saucelabs: {
    username,
    password,
  },
  webdriver: {
    user: username,
    key: password,
    host: 'ondemand.saucelabs.com',
    port: 80,
  },
}

function startServer(port, ops = {}) {
  const server = httpServer.createServer(ops)

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      ngrok.connect(port, (err, url) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Web server ready at ${url}`)
          resolve(url)
        }
      })
    })
  })
}

function startSauceLabs(ops = {}) {
  return Promise.resolve(new SauceLabs(ops))
}

function runTests(ops, saucelabs, url, browser, retries = 0) {
  const { name } = browser

  ops.desiredCapabilities = browser
  console.log('Starting tests for ', name)

  const client = webdriverio.remote(ops)

  client.addCommand('sauceJobStatus', (passed, done) => {
    const id = client.requestHandler.sessionID

    saucelabs.updateJob(id, { passed, tags, build, public: true }, done)
  })

  return client
    .init()
    .url(`${url}/spec/web/index.html`)
    .waitForVisible('#test-results.complete', maxTestTime)
    .getAttribute('#test-results.complete', 'class')
    .then(onClassFound)
    .then(passed => {
      if (passed || ++retries >= maxRetries) {
        return client
          .sauceJobStatus(passed)
          .end()
          .then(() =>
            onComplete(
              passed,
              `Completed tests for ${name} (${passed ? '✔️' : '❌'})`
            )
          )
      }
      console.log(`Starting retry for ${name} (${retries}/${maxRetries})`)
      return timeout(60 * 1000) // wait for 1 full minute to allow ngrok to cool down
        .then(() => console.log('Retrying now...'))
        .then(() => runTests(ops, saucelabs, url, browser, retries))
    })
}

function onClassFound(classNames) {
  if (classNames instanceof Array) {
    classNames = classNames.join(' ')
  }
  return classNames.split(' ').indexOf('all-good') !== -1
}

function timeout(delay, param) {
  return new Promise(resolve => setTimeout(() => resolve(param), delay))
}

function onComplete(passed, msg) {
  if (!passed) {
    console.error('Oops, tests failed')
    console.error(msg)
    ngrok.kill()
    process.exit(1)
  } else if (++testsCompleted === browserList.length) {
    console.log(msg)
    console.log('All tests completed successfully')
    ngrok.kill()
    process.exit(0)
  } else {
    console.log(msg)
  }
}

function getGroups(items, size = 4) {
  const copy = items.slice(0)
  const split = []

  while (copy.length > 0) {
    split.push(copy.splice(0, size))
  }

  return split
}

Promise.all([startServer(httpPort), startSauceLabs(options.saucelabs)])
  .then(([url, saucelabs]) => {
    function runTargetTests(target) {
      return runTests(options.webdriver, saucelabs, url, target)
    }

    // We split the tests into groups to limit the number of requests, otherwise tests may exceed
    // the ngrok connection limit
    return getGroups(browserList).reduce(
      (p, targets) => p.then(() => Promise.all(targets.map(runTargetTests))),
      Promise.resolve()
    )
  })
  .catch(err => onComplete(false, err))
