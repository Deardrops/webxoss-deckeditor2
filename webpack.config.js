'use strict'

const webpack = require('webpack')
const path = require('path')
const html = require('html-webpack-plugin')
const merge = require('webpack-merge')
const extract = require('extract-text-webpack-plugin')
const toPath = relative => path.resolve(__dirname, relative)

const PATHS = {
  index: toPath('src/index.js'),
  template: toPath('src/index.tpl'),
  src: toPath('src'),
  dist: toPath('dist'),
  css: toPath('src/css'),
  js: toPath('src/js'),
  media: toPath('src/media'),
  pages: toPath('src/pages'),
  components: toPath('src/components'),
  CardInfo: toPath('src/CardInfo.json'),
}
const alias = {
  js: PATHS.js,
  css: PATHS.css,
  media: PATHS.media,
  pages: PATHS.pages,
  components: PATHS.components,
}
const TESTS = {
  css: /\.css$/,
  js: /\.js?$/,
  vue: /\.vue$/,
  svg: /\.svg$/,
  txt: /\.(te?xt|md|markdown)$/,
  asset: /\.(webp|jpe?g|png|gif)$/,
  hjson: /\.hjson$/,
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

let lint = 'eslint-loader?configFile=eslint.config.js'

let postcss = {
  plugins: [
    require('postcss-import')({
      resolve: (path) => {
        for (let key in alias) {
          if (path.startsWith(key + '/')) {
            return path.replace(key, alias[key])
          }
        }
        return path
      },
    }),
    require('postcss-cssnext')({
      browsers,
    }),
  ],
}
if (env === 'build') {
  postcss.plugins.push(require('cssnano')({
    autoprefixer: false,
  }))
}

let config = {}

config.base = {
  devtool: 'source-map',
  entry: {
    vue: ['babel-polyfill', 'vue', 'vuex', 'vue-router', 'vuex-router-sync'],
    app: [PATHS.index],
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  module: {
    rules: [
      /* preLoaders */
      {
        enforce: 'pre',
        test: TESTS.vue,
        loader: lint,
        include: PATHS.src,
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: TESTS.js,
        loader: lint,
        include: PATHS.src,
        exclude: /node_modules/,
      },
      /* Loaders */
      {
        test: TESTS.js,
        loaders: [
          'babel-loader?' + JSON.stringify(babel),
        ],
        include: PATHS.src,
        exclude: /node_modules/,
      },
      {
        test: TESTS.vue,
        use: [
          {
            loader: 'vue-loader',
            options: {
              postcss: postcss.plugins,
              cssModules: {
                localIdentName: env === 'dev'
                  ? '[local]_[hash:base64:5]'
                  : '[hash:base64]',
              },
              loaders: env === 'build'
                ? {
                  css: extract.extract({
                    loader: 'css-loader',
                    fallbackLoader: 'vue-style-loader',
                  }),
                }
                : {},
            },
          },
        ],
        include: PATHS.src,
      },
      {
        test: TESTS.svg,
        loaders: [
          'svg-sprite-loader',
          'svgo-loader',
        ],
        include: PATHS.media,
      },
      {
        test: TESTS.asset,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name].[hash:7].[ext]',
              limit: '10000',
            },
          },
        ],
        include: PATHS.src,
      },
      {
        test: TESTS.txt,
        use: 'raw-loader',
        include: PATHS.src,
      },
      {
        test: TESTS.hjson,
        loader: 'hjson-loader',
        include: PATHS.src,
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue',
    }),
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
    alias,
  },
}

config.build = {
  devtool: false,
  output: {
    filename: '[name].[chunkhash:7].js',
    chunkFilename: '[chunkhash:7].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"',
      },
    }),
    new extract('[name].[contenthash:7].css'),
  ],
}

config.dev = {
  devtool: 'eval',
  performance: {
    hints: false,
  },
  entry: {
    app: ['webpack-hot-middleware/client?reload=true'],
  },
  module: {
    loaders: [{
      test: TESTS.js,
      loaders: ['babel-loader?' + JSON.stringify(babel)],
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
}

module.exports = merge.smart(config.base, config[env])
