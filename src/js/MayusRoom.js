let limitPairs = [
  [33, 34],     // 幻獣神 オサキ + 修復
  [33, 84],     // 幻獣神 オサキ + ＴＨＲＥＥ ＯＵＴ
  [1202, 884],  // V・＠・C + 共鸣・进军
  [1202, 1369], // V・＠・C + レゾナンス
  [534, 408],   // ロック・ユー + 烈情の割裂
  [534, 570],   // ロック・ユー + スピリット・サルベージ
  [814, 1090],  // 羅原 Ａｒ + ＭＡＧＩＣ ＨＡＮＤ
  [649, 1562],  // 創世の巫女 マユ + 真名の巫女 マユ
  [957, 1652],  // 台風一過 + コードアンシエンツ ヘルボロス
]

let limitMap = {
  37: 2,   // <忘得ぬ幻想 ヴァルキリー>
  34: 2,   // <修復>
  178: 2,  // <先駆の大天使 アークゲイン>
  534: 1,  // <ロック・ユー>
  474: 0,  // <ノー・ゲイン>
  23: 0,   // <大器晩成>
  689: 0,  // <ＲＡＩＮＹ>
  1030: 0, // <四面楚火>
  1457: 0, // <サーバント Ｚ>
}

export default function checkMayusRoom(cards) {
  let cids = cards.map(card => CardInfo[card.pid].cid)
  for (let pair of limitPairs) {
    if (cids.includes(pair[0]) && cids.includes(pair[1])) {
      return true
    }
  }
  for (let limitCid in limitMap) {
    let limitCount = limitMap[limitCid]
    let count = cids.filter(cid => cid === +limitCid).length
    if (count > limitCount) {
      return true
    }
  }
  return false
}
