'use strict'

const shell = require('shelljs')

shell.rm('-rf', 'dist')

require('webpack')(require('./webpack.config.js'), (err, stats) => {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  }) + '\n')
  shell.cp('-R', 'images', 'dist/images')
  shell.cp('src/CardInfo.json', 'dist')
})
