let concat = Array.prototype.concat.bind([])
let toArr = function(obj) {
  if (!obj) return []
  if (typeof obj === 'string') return []
  return Array.prototype.slice.call(obj, 0)
}
let isArr = Array.isArray
let inArr = function(item, arr) {
  return (toArr(arr).indexOf(item) !== -1)
}
let removeFromArr = function(item, arr) {
  let idx = arr.indexOf(item)
  if (idx < 0) {
    return false
  } else {
    arr.splice(idx, 1)
    return true
  }
}
let isStr = function(v) {
  return (typeof v === 'string')
}
let isObj = function(v) {
  return v && (typeof v === 'object') && !isArr(v)
}
let isNum = function(v) {
  return (typeof v === 'number')
}
let isFunc = function(v) {
  return (typeof v === 'function')
}
let pEach = function(arr, func) {
  return arr.reduce(function(chain, item) {
    return chain.then(function() {
      return func(item)
    })
  }, Promise.resolve())
}

function callConstructor(constructor) {
  let factoryFunction = constructor.bind.apply(constructor, arguments)
  return new factoryFunction()
}

function applyToConstructor(constructor, argArray) {
  // let args = [null].concat(argArray)
  let args = concat(null, toArr(argArray))
  let factoryFunction = constructor.bind.apply(constructor, args)
  return new factoryFunction()
}

function nextTick(callback) {
  setTimeout(callback, 0)
}

export {
	toArr,
	inArr,
	removeFromArr,
	isStr,
	isObj,
	isNum,
	isFunc,
	pEach,
	callConstructor,
	applyToConstructor,
	nextTick,
}
