'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const url = require('url')
const webpack = require('webpack')
const config = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const compiler = webpack(config)
const app = new express()

app.use(webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false,
    children: false,
  },
  lazy: false,
  publicPath: '/',
}))

app.use(webpackHotMiddleware(compiler))

app.use('/images', express.static('./images'))
app.use('/background', express.static('./background'))
app.use('/', express.static('./src'))
app.use('/dist', express.static('./dist'))

app.use('/lang', proxy('hongkong.webxoss.com:8080', {
  proxyReqPathResolver: req => '/lang' + url.parse(req.url).path,
  https: true,
}))

module.exports = app.listen(8080)
