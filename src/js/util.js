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

export function defaultSort(cards){
  // default order:
  // LRIG > ARTS > RESONA > SIGNI > SPELL
  // level / power: high > low
  cards.sort((a, b) => {
    if (a.cardType === 'LRIG') {
      if (b.cardType !== 'LRIG') return -1
      if (b.level !== a.level) {
        return a.level - b.level
      }
    }
    if (a.cardType === 'ARTS') {
      if (b.cardType !== 'ARTS') return 1
    }
    if (a.cardType === 'RESONA') {
      if (b.cardType === 'LRIG') return 1
      if (b.cardType === 'ARTS') return -1
      if (b.level !== a.level) {
        return a.level - b.level
      }
    }
    if (a.cardType === 'SIGNI') {
      if (b.cardType !== 'SIGNI') return -1
      if (a.level !== b.level) {
        return b.level - a.level
      }
      if (a.power !== b.power) {
        return a.power - b.power
      }
    }
    if (a.cardType === 'SPELL') {
      if (b.cardType !== 'SPELL') return 1
    }
    if (a.cid !== b.cid) {
      return a.cid - b.cid
    }
    return 1
  })
}

export function isLrigCard(card) {
  let type = card.cardType
  return (type === 'LRIG') || (type === 'ARTS') || (type === 'RESONA')
}
