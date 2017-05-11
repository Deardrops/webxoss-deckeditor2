import { $get } from './util'

let CardInfo_jp = Object.create(window.CardInfo)
let CardInfo_zh = Object.create(window.CardInfo)
let CardInfo_en = Object.create(window.CardInfo)
let CardInfo_ko = Object.create(window.CardInfo)
let CardInfo_ru = Object.create(window.CardInfo)
let CardInfo_it = Object.create(window.CardInfo)

export function initCardInfos() {
  let CardInfos = {
    'CardInfo_zh_CN': CardInfo_zh,
    'CardInfo_en': CardInfo_en,
    'CardInfo_ko': CardInfo_ko,
    'CardInfo_ru': CardInfo_ru,
  }

  let dir = process.env.NODE_ENV === 'production' ? '../lang/' : './lang/'
  for (let name of Object.keys(CardInfos)) {
    $get(dir + name + '.json')
      .then(translation => {
        for (let pid in translation) {
          let tran = translation[pid]
          let info = Object.create(CardInfo_jp[pid])
          for (let prop in tran) {
            info[prop] = tran[prop]
          }
          info.pid = +info.pid
          CardInfos[name][pid] = info
          if (name === 'CardInfo_en') {
            // Italian CardInfo === English CardInfo
            CardInfo_it = CardInfos[name]
          }
        }
      })
  }
}

const langMaps = {
  'zh_Hans': CardInfo_zh,
  'zh_Hant': CardInfo_zh,
  'en': CardInfo_en,
  'jp': CardInfo_jp,
  'ko': CardInfo_ko,
  'ru': CardInfo_ru,
  'it': CardInfo_it,
}

export const setLanguegeCardInfo = lang => {
  if (lang in langMaps) {
    window.CardInfo = langMaps[lang]
  } else {
    window.CardInfo = langMaps['en']
  }
}
