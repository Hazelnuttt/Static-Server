const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const { createReadStream, createWriteStream } = require('fs')

http
  .createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    const { pathname } = url.parse(req.url)
    let absPath = path.join(__dirname, pathname)
    console.log(absPath)
    try {
      let statObj = await fs.stat(absPath)
      if (statObj.isDirectory()) {
        absPath = path.join(__dirname, '/public/index.html')
        await fs.access(absPath)
      }

      // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())
      // res.setHeader('Cache-Control', 'max-age=10')
      if (req.url.match(/css/)) {
        let ctime = statObj.ctime.toGMTString()
        res.setHeader('Last-Modified', ctime)
        let ifModifiedSince = req.headers['if-modified-since']
        if (ifModifiedSince === ctime) {
          res.statusCode = 304
          return res.end()
        }
      }
      let content = await fs.readFile(absPath, 'utf-8')
      res.end(content)
    } catch (e) {
      res.end('Not Found')
    }
  })
  .listen(3000)
