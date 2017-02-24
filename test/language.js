'use strict'

const fs = require('fs')
const _ = require('lodash')
const Hjson = require('hjson')

const dir = './src/lang/'
let names = []
if (!fs.statSync(dir).isDirectory()) {
  console.error(`no such directory: ${dir}`)
  process.exit(1)
} else {
  names = fs.readdirSync(dir)
}

let maps = {}
names.forEach(name => {
  let hjson = fs.readFileSync(`${dir}${name}`, 'utf-8')
  let json = Hjson.parse(hjson)
  maps[name] = json
})

let checkFailed = false
function checkLanguage(name) {
  let keys = Object.keys(maps[name])
  let originKeys = Object.keys(maps['en.hjson'])
  let surplusKeys = _.difference(keys, originKeys)
  if (surplusKeys.length) {
    console.error(`Surplus keys in ${name}`)
    console.log(surplusKeys)
    checkFailed = true
  }
  let lackKeys = _.difference(originKeys, keys)
  if (lackKeys.length) {
    console.error(`Lack keys in ${name}`)
    console.log(lackKeys)
    checkFailed = true
  }
}

names.forEach(name => {
  if (name === 'en.hjson') {
    return
  }
  checkLanguage(name)
})

if (checkFailed) {
  process.exit(1)
} else {
  console.log(names)
  console.log('All language file test passed!')
}
