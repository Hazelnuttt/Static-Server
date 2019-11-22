//解决嵌套
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const { createReadStream, createWriteStream } = require('fs')
const mime = require('mime')
const nunjucks = require('nunjucks')

class Server {
  constructor(config) {
    this.port = config.port
    this.dir = config.dir
  }
  /**
   *
   * @param  {...any} args 端口号
   * @function handleRequest 处理请求的方法
   * @function sendError 处理文件找不到的错误
   * @function sendFile 处理文件
   */
  async handleRequest(req, res) {
    //处理路径
    let { pathname } = url.parse(req.url)
    let absPath = path.join(this.dir, pathname)
    console.log(this.dir)
    console.log(pathname)
    try {
      let statObj = await fs.stat(absPath)
      if (statObj.isFile()) {
        this.sendFile(absPath, req, res, statObj)
      } else {
        let children = await fs.readdir(absPath)
        // 数据  + 模板引擎 nunjucks
        children = children.map(item => {
          return {
            current: item,
            parent: path.join(pathname, item) // 将自己的当前的路径 和 文件名进行拼接 组成一个新的连接
          }
        })
        let templateStr = nunjucks.render(path.resolve(__dirname, 'template.html'), {
          items: children
        })
        res.setHeader('Content-Type', 'text/html;charset=utf8')
        res.end(templateStr)
        //console.log(children)
      }
    } catch (e) {
      console.log(e)
      this.sendError(e, res)
    }
  }

  sendFile(currentPath, req, res) {
    //可以是文件流，也可以文件读写
    res.setHeader('Content-Type', mime.getType(currentPath) + ';charset=utf-8')
    createReadStream(currentPath).pipe(res)
  }
  sendError(err, res) {
    res.statusCode = 404
    res.end('Not Found')
  }
  start() {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(this.port, () => {
      console.log(`Starting up http-server, serving./${this.dir.split('\\').pop()}
      Available on:
      http://127.0.0.1:${this.port}
      Hit CTRL-C to stop the server`)
    })
  }
}

module.exports = Server

// let defaultConfig = {
//   port: 3000,
//   //当前在哪个文件夹，就打开它
//   dir: process.cwd()
// }
// let server = new Server(defaultConfig)
// server.start()
