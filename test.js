'use strict'

const compiler = require('webpack')(require('./webpack.config.js'))
compiler.outputFileSystem = new (require('memory-fs'))()

compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    process.exit(1)
  }

  const info = stats.toJson()
  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }
  if (stats.hasErrors()) {
    info.errors.forEach(console.error)
    process.exit(1)
  }
})
