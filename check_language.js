'use strict'

const rf = require('fs')

const lang_dir = './src/lang/'

const Hjson = require('hjson')

const lang_names = [
  'en',
  'it',
  'jp',
  'ko',
  'ru',
  'zh_Hans',
]

const lang_maps = {}

lang_names.forEach(function (name) {
  const hjson = rf.readFileSync(lang_dir + name + '.hjson', 'utf-8')
  const json = Hjson.parse(hjson)
  lang_maps[name] = json
})

const _ = require('lodash')

function check_keys(name) {
  const keys = Object.keys(lang_maps[name])
  const origin_keys = Object.keys(lang_maps['en'])
  const surplus_keys = _.difference(keys, origin_keys)
  if (surplus_keys.length !== 0) {
    console.log('Surplus keys in ' + name)
    console.log(surplus_keys)
  }
  const lack_keys = _.difference(origin_keys, keys)
  if (lack_keys.length !== 0) {
    console.log('Lack keys in ' + name)
    console.log(lack_keys)
  }
}

lang_names.forEach(function (name) {
  if (name === 'en') {
    return
  }
  check_keys(name)
})

console.log('All Done!')
