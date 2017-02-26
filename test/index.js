'use strict'
const tests = {
  'language': './language.js',
  'complie': './complie.js',
}

const args = process.argv.slice(2)
if (!args.length) {
  // default: run all tests
  for (let name in tests) {
    require(tests[name])
  }
} else {
  let arg = args[0]
  if (arg in tests) {
    require(tests[arg])
  } else {
    console.warn(`No such test: ${arg}`)
  }
}
