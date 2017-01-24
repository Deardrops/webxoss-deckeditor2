export const concat = Array.prototype.concat.bind([])
export function toArr(obj) {
  if (!obj) return []
  if (typeof obj === 'string') return []
  return Array.prototype.slice.call(obj, 0)
}
export const isArr = Array.isArray
export function inArr (item, arr) {
  return (toArr(arr).indexOf(item) !== -1)
}
export function removeFromArr(item, arr) {
  let idx = arr.indexOf(item)
  if (idx < 0) {
    return false
  } else {
    arr.splice(idx, 1)
    return true
  }
}
export function isStr(v) {
  return (typeof v === 'string')
}
export function isObj(v) {
  return v && (typeof v === 'object') && !isArr(v)
}
export function isNum(v) {
  return (typeof v === 'number')
}
export function isFunc(v) {
  return (typeof v === 'function')
}
export function pEach(arr, func) {
  return arr.reduce(function (chain, item) {
    return chain.then(function () {
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

export function $get (url) {
  let xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  return new Promise((resolve, reject) => {
    xhr.onload = () => resolve(xhr.response)
    xhr.onerror = reject
    xhr.open('GET', url, true)
    xhr.send()
  })
}
