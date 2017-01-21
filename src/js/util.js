export const concat = Array.prototype.concat.bind([])
export const toArr = function(obj) {
  if (!obj) return []
  if (typeof obj === 'string') return []
  return Array.prototype.slice.call(obj, 0)
}
export const isArr = Array.isArray
export const inArr = function(item, arr) {
  return (toArr(arr).indexOf(item) !== -1)
}
export const removeFromArr = function(item, arr) {
  let idx = arr.indexOf(item)
  if (idx < 0) {
    return false
  } else {
    arr.splice(idx, 1)
    return true
  }
}
export const isStr = function(v) {
  return (typeof v === 'string')
}
export const isObj = function(v) {
  return v && (typeof v === 'object') && !isArr(v)
}
export const isNum = function(v) {
  return (typeof v === 'number')
}
export const isFunc = function(v) {
  return (typeof v === 'function')
}
export const pEach = function(arr, func) {
  return arr.reduce(function(chain, item) {
    return chain.then(function() {
      return func(item)
    })
  }, Promise.resolve())
}

export function callConstructor(constructor) {
  let factoryFunction = constructor.bind.apply(constructor, arguments)
  return new factoryFunction()
}

export function applyToConstructor(constructor, argArray) {
  // let args = [null].concat(argArray)
  let args = concat(null, toArr(argArray))
  let factoryFunction = constructor.bind.apply(constructor, args)
  return new factoryFunction()
}

export function nextTick(callback) {
  setTimeout(callback, 0)
}
