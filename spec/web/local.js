const httpServer = require('http-server')
const ngrok = require('ngrok')

const httpPort = 8080

function startServer(port, ops = {}) {
  const server = httpServer.createServer(ops)

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      ngrok.connect(port, (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
  })
}

startServer(httpPort)
  .then(url => {
    console.log(`Web server ready. See results at ${url}/spec/web`)
  })
  .catch(err => {
    console.error("Web server couldn't start", err)
  })
