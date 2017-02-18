import traditionalize from 'js/traditionalize'

let maps = {
  zh_Hans: require('../lang/zh_Hans.hjson'),
  en: require('../lang/en.hjson'),
  jp: require('../lang/jp.hjson'),
  ru: require('../lang/ru.hjson'),
  it: require('../lang/it.hjson'),
  ko: require('../lang/ko.hjson'),
}

// Traditional Chinese map
maps['zh_Hant'] = Object.create(maps['zh_Hans'])
maps['zh_Hant'].traditional = true

// summary: return localize text in namespace 'page'
// usage:   Localize('label')
//   e.g.   Localize('cancel')
export default function Localize(label) {
  return Localize.page(label)
}

Localize.map = maps['en']

// namespace:
//   _misc, prop, cardType, color,
//   costColor, timming, class, page
//
// usage: Localize.namespace('label')
//   e.g. Localize.color('red')
for (let namespace in Localize.map) {
  Localize[namespace] = (label, ...values) => {
    let str = Localize.map[namespace][label]
    if (!str) {
      console.warn(`no such label: "${label}"`)
      return label
    }
    str = Localize.formatString(str, values)
    str = Localize.traditionalize(str)
    return str
  }
}

// shortcut:
// misc - map namespace '_misc'
let misc = Localize._misc.bind(Localize)

// suff - add language suffix to string
function suff(str) {
  return str + Localize.map.suffix
}

Localize.init = function() {
  let lang = Localize.getLanguage()
  Localize.setLanguage(lang)
}

Localize.getLanguage = () => {
  // =======兼容处理=======
  let lang = localStorage.getItem('language') || 'en'
  if (lang === 'zh_CN') {
    return 'zh_Hans'
  } else if (lang === 'zh_TW') {
    return 'zh_Hant'
  } else {
    return lang
  }
  // ======================
  //return localStorage.getItem('language') || 'en'
}

Localize.setLanguage = lang => {
  // =======兼容处理=======
  Localize.map = maps[lang] || maps['en']
  if (lang === 'zh_Hans') {
    localStorage.setItem('language', 'zh_CN')
  } else if (lang === 'zh_Hant') {
    localStorage.setItem('language', 'zh_TW')
  } else {
    localStorage.setItem('language', lang)
  }
  // ======================
  //localStorage.setItem('language', lang)
}

Localize.formatString = (str, values) => {
  for (let value of values) {
    str = str.replace('%s', value)
  }
  return str
}

// Simplified Chinese String -> Traditional Chinese String
// see traditionalize.js for more detail
Localize.traditionalize = traditionalize

Localize.cardName = info => {
  return Localize.traditionalize(info[suff('name')])
}

Localize.effectTexts = info => {
  info = CardInfo[info.cid]
  // 额外
  let texts = [].concat(info[suff('extraTexts')] || [])
  // 防御
  if (info.guardFlag) {
    texts.push(misc('GUARD_DESCRIPTION'))
  }
  // 万花
  if (info.multiEner) {
    texts.push(misc('MULTI_ENER_DESCRIPTION'))
  }
  // CROSS
  function toNames(cross) {
    return [].concat(cross).map(cid => {
      return misc('CROSS_NAME_QUOTE_LEFT') +
        Localize.cardName(CardInfo[cid]) +
        misc('CROSS_NAME_QUOTE_RIGHT')
    }).join(misc('CROSS_OR'))
  }
  if (info.crossLeft && info.crossRight) {
    texts.push(misc('CROSS_AND', toNames(info.crossLeft), toNames(info.crossRight)))
  } else if (info.crossLeft) {
    texts.push(misc('CROSS_LEFT', toNames(info.crossLeft)))
  } else if (info.crossRight) {
    texts.push(misc('CROSS_RIGHT', toNames(info.crossRight)))
  }
  // 魔法技艺
  [suff('spellEffectTexts'), suff('artsEffectTexts')].forEach(prop => {
    if (!info[prop]) {
      return
    }
    texts.push(info[prop][0])
  }, this)
  // 常出起
  let tmp = [suff('constEffectTexts'), suff('startUpEffectTexts'), suff('actionEffectTexts')]
  tmp.forEach(prop => {
    if (!info[prop]) {
      return
    }
    texts = texts.concat(info[prop])
  }, this)
  return Localize.traditionalize(texts.join('\n')) || '-'
}

Localize.burstEffectTexts = info => {
  info = CardInfo[info.cid]
  if (!info[suff('burstEffectTexts')]) {
    return '-'
  }
  return Localize.traditionalize(info[suff('burstEffectTexts')][0])
}

Localize.guard = info => {
  return info.guardFlag ? misc('GUARD_TRUE') : misc('GUARD_FALSE')
}

Localize.cost = info => {
  if (info.costOr) {
    return info.costOr.map(color => {
      return Localize.color(color)
    }, this).join(' ' + Localize('or') + ' ')
  }
  let props = ['costWhite', 'costBlack', 'costRed', 'costBlue', 'costGreen', 'costColorless']
  let text = ''
  props.forEach(prop => {
    if (info[prop]) {
      text += Localize.costColor(prop) + info[prop] + ' '
    }
  })
  if (!text) text = Localize.costColor('costColorless') + '0'
  return text
}

Localize.timmings = info => {
  info = CardInfo[info.cid]
  if (!info.timmings) {
    return '-'
  }
  return info.timmings.map(function(timming) {
    return Localize.timming(timming)
  }).join('\n') || '-'
}

Localize.limiting = info => {
  if (!info.limiting) {
    return ''
  }
  let cls = info.limiting.split('/').map(limiting => {
    if (!limiting) {
      return true
    }
    return Localize.class(limiting)
  }).join('/')
  return misc('LIMITING', cls)
}

Localize.classes = info => {
  if (!info.classes) {
    return '-'
  }
  let separator = misc('CLASS_SEPARATOR')
  return info.classes.map(cls => {
    if (cls === '?') {
      return '?'
    }
    return Localize.class(cls)
  }).join(separator) || '-'
}
