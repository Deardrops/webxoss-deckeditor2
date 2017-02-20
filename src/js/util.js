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
  let sortedCards = cards.slice()
  sortedCards.sort((a, b) => {
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
  return sortedCards
}

export function isLrigCard(card) {
  let type = card.cardType
  return (type === 'LRIG') || (type === 'ARTS') || (type === 'RESONA')
}

let limitPairs = [
  [33, 34], // 狐狸 + 修复
  [33, 84], // 狐狸 + Three out
  [1202, 884], // V・＠・C + 共鸣・进军
  [1202, 1369], // V・＠・C + 共鸣
  [534, 408], // Lock + 割裂
  [534, 570], // Lock + 精挖
  [814, 1090], // Ar + 魔术手
  [649, 1562], // 創世の巫女 マユ + 真名の巫女 マユ
  [957, 1652], // 台風一過 + コードアンシエンツ ヘルボロス
]

let limitMap = {
  37: 2,  // <忘得ぬ幻想 ヴァルキリー>
  34: 2,  // <修復>
  178: 2, // <先駆の大天使 アークゲイン>
  534: 1, // <ロック・ユー>
  // 689: 1, // <ＲＡＩＮＹ>
  474: 0, // <ノー・ゲイン>
  23: 0,  // <大器晩成>
  689: 0, // <ＲＡＩＮＹ>
  1030: 0, // <四面楚火>
  1457: 0, // <サーバント Ｚ>
}

export function checkMayusRoom(decks) {
  if (!decks) {
    return true
  }
  let deckLimited = false
  let cids = decks.map(card => CardInfo[card.pid].cid)
  for (let pair of limitPairs) {
    if (cids.includes(pair[0]) && cids.includes(pair[1])) {
      deckLimited = true
      break
    }
  }
  for (let [limitCid, limitCount] of Object.entries(limitMap)) {
    let count = cids.filter(cid => cid === +limitCid).length
    if (count > limitCount) {
      deckLimited = true
      break
    }
  }
  return deckLimited
}
