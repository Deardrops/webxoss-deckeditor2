import traditionalize from 'js/traditionalize'

let maps = {
  zh_Hans: require('../lang/zh_Hans.hjson'),
  zh_Hant: Object.assign({}, require('../lang/zh_Hans.hjson'), {
    traditional: true,
  }),
  en: require('../lang/en.hjson'),
  jp: require('../lang/jp.hjson'),
  ru: require('../lang/ru.hjson'),
  it: require('../lang/it.hjson'),
  ko: require('../lang/ko.hjson'),
}

// add language suffix to string
const suff = str => {
  return str
  // return str + Localize.getMap().suffix
}

// replace `%s` with args
const formatString = (str, args) => {
  for (let arg of args) {
    str = str.replace('%s', arg)
  }
  return str
}

export default function Localize(label, ...args) {
  let map = Localize.getMap()
  if (!(label in map)) {
    console.warn(`no such label: "${label}"`)
    return label
  }
  let str = Localize.traditionalize(formatString(map[label], args))
  return str
}

// default to english
Localize.config = {
  lang: 'en',
}

Localize.getMap = () => {
  return maps[Localize.config.lang] || maps['en']
}

Localize.traditionalize = str => {
  if (!Localize.getMap().traditional) {
    return str
  }
  return traditionalize(str)
}

Localize.cardName = info => {
  return Localize.traditionalize(info[suff('name')])
}

Localize.effectTexts = info => {
  info = CardInfo[info.cid]
  // extra
  let texts = [].concat(info[suff('extraTexts')] || [])
  // guard
  if (info.guardFlag) {
    texts.push(Localize('GUARD_DESCRIPTION'))
  }
  // mult ener
  if (info.multiEner) {
    texts.push(Localize('MULTI_ENER_DESCRIPTION'))
  }
  // CROSS
  function toNames(cross) {
    return [].concat(cross).map(cid => {
      return Localize('CROSS_NAME_QUOTE_LEFT') +
        Localize.cardName(CardInfo[cid]) +
        Localize('CROSS_NAME_QUOTE_RIGHT')
    }).join(Localize('CROSS_OR'))
  }
  if (info.crossLeft && info.crossRight) {
    texts.push(Localize('CROSS_AND', toNames(info.crossLeft), toNames(info.crossRight)))
  } else if (info.crossLeft) {
    texts.push(Localize('CROSS_LEFT', toNames(info.crossLeft)))
  } else if (info.crossRight) {
    texts.push(Localize('CROSS_RIGHT', toNames(info.crossRight)))
  }
  // SPELL && ARTS
  [suff('spellEffectTexts'), suff('artsEffectTexts')].forEach(prop => {
    if (!info[prop]) {
      return
    }
    texts.push(info[prop][0])
  }, this)
  // Cost, On-Play, Action
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
  return info.guardFlag ? Localize('GUARD_TRUE') : Localize('GUARD_FALSE')
}

Localize.cost = info => {
  if (info.costOr) {
    return info.costOr.map(color => {
      return Localize(color)
    }, this).join(' ' + Localize('or') + ' ')
  }
  let props = ['costWhite', 'costBlack', 'costRed', 'costBlue', 'costGreen', 'costColorless']
  let text = ''
  props.forEach(prop => {
    if (info[prop]) {
      text += Localize(prop) + info[prop] + ' '
    }
  })
  if (!text) text = Localize('costColorless') + '0'
  return text
}

Localize.timings = info => {
  info = CardInfo[info.cid]
  if (!info.timmings) {
    return '-'
  }
  return info.timmings.map(function(timing) {
    return Localize(timing)
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
    return Localize(limiting)
  }).join('/')
  return Localize('LIMITING', cls)
}

Localize.classes = info => {
  if (!info.classes) {
    return '-'
  }
  let separator = Localize('CLASS_SEPARATOR')
  return info.classes.map(cls => {
    if (cls === '?') {
      return '?'
    }
    return Localize(cls)
  }).join(separator) || '-'
}
