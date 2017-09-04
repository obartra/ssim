const test = require('blue-tape')
const { exec } = require('child_process')

const img1 = './spec/samples/lena/Q_09372.gif'
const img2 = './spec/samples/lena/color.jpg'
const ssimValue = 0.3006

test('should be a function', t => {
  exec(`./cli.js ${img1} ${img2}`, (err, stdout, stderr) => {
    t.equal(err, null)
    t.equal(stderr, '')
    t.equal(stdout.indexOf(`SSIM: ${ssimValue}`), 0, stdout)
    t.end()
  })
})

test('should fail on threshold mode when output is below the threshold', t => {
  exec(`./cli.js ${img1} ${img2} --threshold ${ssimValue + 0.1}`, err => {
    t.equal(err && err.code, 1)
    t.end()
  })
})

test('should succeed on threshold mode when output is below the threshold', t => {
  exec(`./cli.js ${img1} ${img2} --threshold ${ssimValue - 0.1}`, err => {
    t.equal(err, null)
    t.end()
  })
})

test('should provide no output when using --threshold and --quiet', t => {
  exec(
    `./cli.js ${img1} ${img2} --threshold ${ssimValue - 0.1} --quiet`,
    (err, stdout) => {
      t.equal(stdout, '')
      t.end()
    }
  )
})

test('should only output ssim value when using --quiet', t => {
  exec(`./cli.js ${img1} ${img2} --quiet`, (err, stdout) => {
    t.equal(`${ssimValue}`, stdout.trim())
    t.end()
  })
})
