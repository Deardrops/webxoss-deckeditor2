'use strict'

const express = require('express')
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
app.use('/', express.static('./client'))
app.use('/dist', express.static('./dist'))

module.exports = app.listen(8080)
