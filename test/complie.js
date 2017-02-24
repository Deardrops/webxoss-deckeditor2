'use strict'

const webpack = require('webpack')
const config = require(process.cwd() + '/webpack.config.js')
const compiler = webpack(config)

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

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  }) + '\n')
})
