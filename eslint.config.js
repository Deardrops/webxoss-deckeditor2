'use strict'

const merge = require('merge')

let env = process.env.npm_lifecycle_event === 'lint' ? 'node' : 'src'

let config = {}

config.base = {
  env: {
    'es6': true,
  },
  globals: {
    'require': true,
    'process': true,
    'CardInfo': true,
    'cancelIdleCallback': true,
  },
  extends: 'eslint:recommended',
  plugins: ['vue'],
  rules: {
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
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
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
  env: {
    'node': true,
  },
  parserOptions: {
    'sourceType': 'script',
  },
}

config.src = {
  env: {
    'browser': true,
  },
  parserOptions: {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true,
    },
    'sourceType': 'module',
  },
}

module.exports = merge.recursive(true, config.base, config[env] || config.src)
