'use strict'

const fs = require('fs')

const dir = './src/lang/'

let names = []

if (!fs.statSync(dir).isDirectory()) {
  console.error('no such directory: ' + dir)
  process.exit(1)
} else {
  names = fs.readdirSync(dir)
}

const Hjson = require('hjson')

let maps = {}

names.forEach(function (name) {
  let hjson = fs.readFileSync(dir + name, 'utf-8')
  let json = Hjson.parse(hjson)
  maps[name] = json
})

const _ = require('lodash')

let checkFail = false

function checkLanguage(name) {
  let keys = Object.keys(maps[name])
  let originKeys = Object.keys(maps['en.hjson'])
  let surplusKeys = _.difference(keys, originKeys)
  if (surplusKeys.length) {
    console.warn('Surplus keys in ' + name)
    console.log(surplusKeys)
    checkFail = true
  }
  let lackKeys = _.difference(originKeys, keys)
  if (lackKeys.length) {
    console.warn('Lack keys in ' + name)
    console.log(lackKeys)
    checkFail = true
  }
}

names.forEach(function (name) {
  if (name === 'en.hjson') {
    return
  }
  checkLanguage(name)
})

if (checkFail) {
  process.exit(1)
} else {
  console.log('All Done!')
}
