'use strict'

const merge = require('merge')

let env = process.env.npm_lifecycle_event.replace('lint:', '')
let config = {}

config.base = {
  'env': {
    'es6': true,
  },
  'globals': {
    'process': true,
  },
  'extends': 'eslint:recommended',
  'rules': {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'eol-last': 'error',
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'no-console': 'off',
    'no-unsafe-negation': 'error',
    'array-callback-return': 'error',
    'strict': [
      'error',
      'global',
    ],
    'no-labels': 'error',
    'eqeqeq': 'error',
    'comma-spacing': [
      'warn',
      {
        'before': false,
        'after': true,
      },
    ],
    'no-trailing-spaces': 'error',
    'no-var': 'error',
  },
}

config.node = {
  'env': {
    'node': true,
  },
  'parserOptions': {
    'sourceType': 'script',
  },
}

config.src = {
  'env': {
    'browser': true,
  },
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true,
    },
    'sourceType': 'module',
  },
}

module.exports = merge.recursive(true, config.base, config[env] || config.src)
