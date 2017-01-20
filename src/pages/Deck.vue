<script>
import { mapGetters } from 'vuex'
import CardCell from 'components/CardCell'

export default {
  components: {
    CardCell,
  },
  created() {
    this.$store.commit('fillDeck', [
      1912,
      1912,
      233,
      976,
      976,
      767,
      767,
      767,
      1590,
      1590,
      1590,
      1590,
      234,
      234,
      1591,
      1591,
      1591,
      1591,
      1913,
      1913,
      1913,
      235,
      235,
      1592,
      1592,
      1592,
      236,
      236,
      236,
      236,
      1919,
      1919,
      1919,
      1593,
      1593,
      1593,
      1918,
      1918,
      1243,
      966,
      126,
      125,
      12,
      123,
      3,
      1909,
      1878,
      1908,
      1910,
      1910,
    ])
  },
  computed: {
    ...mapGetters([
      'mainCards',
      'lrigCards',
      'deckName',
    ]),
  },
  methods: {
    showSeach() {
      this.$store.commit('changeToSearchView')
    },
  },
}
</script>

<template>
  <div id="Deck" v-show="this.$store.state.isDeckView">
<!--      <a id="link-back-to-webxoss" href="../">完成编辑</a>
      <div id="div-deck">
        <div>
          <span id="label-select-deck">选择牌组:</span>
          <select id="select-decks"></select>
          <button id="button-delete-deck">删除</button>
          <button id="button-rename">重命名</button>
        </div>
        <div id="div-new-deck">
          <span id="label-new-deck">新建牌组:</span>
          <input id="input-new-deck-name" type="text" placeholder="牌组名字">
          <button id="button-new-deck">新建</button>
          <button id="button-copy-deck">复制</button>
          <button id="button-import-export">导入/导出</button>
        </div>
      </div> -->
    <nav class="nav-bar" @click="showSeach">
    <!-- <nav class="nav-bar" > -->
      <button tabindex="0" type="button" class="nav-button"><div>
      <svg viewBox="0 0 24 24" style="display: inline-block; color: rgb(255, 255, 255); fill: rgb(255, 255, 255); height: 24px; width: 24px; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; user-select: none;"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg></div>
      </button>
      <h1 class="deck-name"><a>{{ deckName }}</a></h1>
      <!-- <div class="dropmenu"><button></button></div> -->
    </nav>
    <div class="main-deck-text-bar">
      <span class="main-deck-title">主卡组</span>
      <!-- <a target="_blank" href="http://www.takaratomy.co.jp/products/wixoss/rule/rule_mayu_room.html" id="main-deck-mayus-room">茧的房间</a> -->
      <!-- <span id="main-deck-burst"><span id="main-deck-burst-title">爆发:</span> -->
      <!-- <span id="main-deck-burst-count"></span><span>/20</span></span> -->
    </div>
    <div class="main-deck-zone">
      <CardCell :cardIds="mainCards"></CardCell>
    </div>
    <div class="lrig-deck">
      <div class="lrig-deck-text-bar">
        <span class="lrig-deck-title">LRIG卡组</span>
      </div>
    <div class="lrig-deck-zone">
      <CardCell :cardIds="lrigCards"></CardCell>
      <!-- <div id="div-import-warp" style="display: none;">
        <div id="div-import-export">
          <div>
            <span id="label-import-from-file">从文件导入:</span>
            <input id="input-file" type="file">
          </div>
          <div>
            <span id="label-export-to-file">导出到文件:</span>
            <button id="button-export">导出</button>
          </div>
          <div>
            <textarea id="textarea-import-export"></textarea>
          </div>
          <div id="div-import-footer">
            <button id="button-text">显示文本</button>
            <button id="button-export-code">显示代码</button>
            <button id="button-import-code">导入代码</button>
            <button id="button-import-export-cancel">取消</button>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.main-deck-text-bar,
.lrig-deck-text-bar {
  text-align: center;
}
.main-deck-zone,
.lrig-deck-zone {
  width: 100%;
  margin: 0 auto;
}

/* test use */
.nav-bar {
  color: rgba(0, 0, 0, 0.870588);
  background-color: #2196f3;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  border-radius: 0px;
  position: relative;
  z-index: 1100;
  width: 100%;
  display: flex;
  padding-left: 24px;
  padding-right: 24px;
}
.nav-button {
  border: 10px;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  margin: 8px 8px 0px -16px;
  padding: 12px;
  outline: none;
  font-size: 0px;
  font-weight: inherit;
  position: relative;
  overflow: visible;
  width: 48px;
  height: 48px;
  background: none;
}
.deck-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px;
  padding-top: 0px;
  letter-spacing: 0px;
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  height: 64px;
  line-height: 64px;
  flex: 1 1 0%;
}
</style>