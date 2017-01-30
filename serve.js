'use strict'

const express = require('express')
const app = new express()
app.use(require('compression')())
app.use(express.static('dist'))

let port = +process.argv[1] || 8888
require('dns').lookup(require('os').hostname(), (err, ip) => {
  if (err) {
    ip = '127.0.0.1'
  }
  console.log(`serving /dist as / on ${ip}:${port}`)
  module.exports = app.listen(port)
})
