import { $get } from './util'

window.CardInfo_jp = Object.create(window.CardInfo)
window.CardInfo_zh = Object.create(window.CardInfo)
window.CardInfo_en = Object.create(window.CardInfo)
window.CardInfo_ko = Object.create(window.CardInfo)
window.CardInfo_ru = Object.create(window.CardInfo)
window.CardInfo_it = Object.create(window.CardInfo)

export default function initCardInfos() {
  let CardInfos = {
    'CardInfo_zh_CN': window.CardInfo_zh,
    'CardInfo_en': window.CardInfo_en,
    'CardInfo_ko': window.CardInfo_ko,
    'CardInfo_ru': window.CardInfo_ru,
  }

  let dir = location.pathname.match(/\/next\/?$/) ? '../lang/' : './lang/'
  for (let name of Object.keys(CardInfos)) {
    $get(dir + name + '.json')
      .then(translation => {
        for (let pid in translation) {
          let tran = translation[pid]
          let info = Object.create(window.CardInfo_jp[pid])
          for (let prop in tran) {
            info[prop] = tran[prop]
          }
          info.pid = +info.pid
          CardInfos[name][pid] = info
          if (name === 'CardInfo_en') {
            window.CardInfo_it = CardInfos[name]
          }
        }
      })
  }
}

const langMaps = {
  'zh_Hans': window.CardInfo_zh,
  'zh_Hant': window.CardInfo_zh,
  'en': window.CardInfo_en,
  'jp': window.CardInfo_jp,
  'ko': window.CardInfo_ko,
  'ru': window.CardInfo_ru,
  'it': window.CardInfo_it,
}

export const setCardInfo = lang => {
  if (lang in langMaps) {
    window.CardInfo = langMaps[lang]
  } else {
    window.CardInfo = langMaps['en']
  }
}
