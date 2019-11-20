#! /usr/bin/env node
let program = require('commander')

let config = {
  '-p,--port <val>': 'set http-server port',
  '-d,--dir <dir>': 'set http-server directory'
}

//遍历
Object.entries(config).forEach(([key, value]) => {
  program.option(key, value)
})

program.name('static-server').usage('<options>')

program.on('--help', function() {
  console.log('Examples:')
  console.log(`   $ static-server --port 3000`)
})
let obj = program.parse(process.argv) //用户传的配置

let Server = require('../static-server.js')

let defaultConfig = {
  port: 3000,
  //当前在哪个文件夹，就打开它
  dir: process.cwd(),
  ...obj
}
let server = new Server(defaultConfig)
server.start()
