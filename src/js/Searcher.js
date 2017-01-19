import * as ruleList from 'js/Rules.js'

function Searcher() {
  this.infos = []
  for (let pid in CardInfo) {
    this.infos.push(CardInfo[pid])
  }
  this.rules = []
  // how to convert an obj to arr in es6's way
  for (let i in ruleList){
    this.rules.push(ruleList[i])
  }
    // this.rules = rule
    // this.rules = [
    //   ColorRule,
    //   CrossRule,
    //   TypeRule,
    //   RarityRule,
    //   SkillRule,
    //   NoBurstRule,
    //   // LifeBurstRule,
    //   TimmingRule,
    //   LimitingRule,
    //   ClassRule,
    //   PowerRule,
    //   LevelRule,
    //   LimitRule,
    //   NumberRule,
    //   IllustRule,
    //   WxidRule,
    //   NameRule,
    // ]
}
Searcher.prototype.search = function(str) {
  // if (!str) return [];
  let words = str.toLowerCase().split(/\s+/)
  let filters = this.rules.map(function(rule) {
    return rule.parse(words)
  }, this)
  return filters.reduce(function(results, filter) {
    return results.filter(filter)
  }, this.infos)
}

export default Searcher
