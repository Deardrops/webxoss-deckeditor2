'use strict'

const webpack = require('webpack')
const path = require('path')
const html = require('html-webpack-plugin')
const merge = require('webpack-merge')
const clean = require('clean-webpack-plugin')
const extract = require('extract-text-webpack-plugin')
const cssnext = require('postcss-cssnext')
const toPath = relative => path.resolve(__dirname, relative)

const PATHS = {
  index: toPath('client/index.js'),
  template: toPath('client/index.tpl'),
  src: toPath('client'),
  dist: toPath('dist'),
  css: toPath('dist/css'),
  components: toPath('client/components'),
}
const TESTS = {
  css: /\.css$/,
  js: /\.js?$/,
  vue: /\.vue$/,
}
let browsers = [
  'last 2 versions',
  'ie >= 10',
  'Firefox ESR',
  'Android >= 4.3',
  'iOS >= 8',
  'last 2 ChromeAndroid versions',
].join(', ')
let env = process.env.npm_lifecycle_event

let babel = {
  presets: [
    'es2015',
    'stage-1',
  ],
  cacheDirectory: true,
}

let postcss = {
  plugins: [cssnext({
    browsers,
  })],
}

let config = {}

config.base = {
  devtool: 'source-map',
  entry: {
    vue: ['vue', 'vuex', 'vue-router', 'vuex-router-sync'],
    app: PATHS.index,
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: TESTS.css,
      use: [
        'style',
        'css?modules&sourceMap',
        {
          loader: 'postcss-loader',
          options: postcss,
        },
      ],
      include: PATHS.src,
    }, {
      test: TESTS.js,
      loaders: [
        'babel-loader?' + JSON.stringify(babel),
        // 'eslint-loader?configFile=eslint.config.js',
      ],
      include: PATHS.src,
      exclude: /node_modules/,
    }, {
      test: TESTS.vue,
      use: [
        {
          loader: 'vue-loader',
          options: {
            postcss: postcss.plugins,
          },
        },
      ],
      include: PATHS.src,
    }],
  },
  plugins: [
    new html({
      title: 'test',
      filename: 'index.html',
      template: PATHS.template,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
    }),
  ],
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.vue',
    ],
    alias: {
      components: PATHS.components,
    },
  },
}

config.build = {
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js',
  },
  module: {
    loaders: [{
      test: TESTS.css,
      loader: extract.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?modules&sourceMap!postcss',
      }),
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"',
      },
    }),
    new clean([PATHS.dist], {
      root: process.cwd(),
    }),
    new extract('[name].[contenthash].css'),
  ],
}

config.dev = {
  devtool: 'eval',
  devServer: {
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: '0.0.0.0',
  },
  performance: {
    hints: false,
  },
  module: {
    loaders: [{
      test: TESTS.js,
      loaders: ['babel-loader?' + JSON.stringify(babel)],
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
}

module.exports = merge.smart(config.base, config[env])
