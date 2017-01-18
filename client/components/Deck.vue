<script>
import { mapGetters } from 'vuex'
import DeckTemplate from './DeckTemplate'
export default {
  components: {
    DeckTemplate,
  },
  created() {
    this.$store.commit('fillDeckFile', {
      mainDeck: [
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
      ],
      lrigDeck: [
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
      ],
    })
    this.$store.commit('initDeck')
  },
  computed: {
    ...mapGetters([
      'mainDeck',
      'lrigDeck',
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
    <div class="title-bar" @click="showSeach">
      <div class="deck-name"><a>{{ deckName }}</a></div>
      <div class="control"><!-- ☰ -->三</div>
      <!-- <div class="dropmenu"><button></button></div> -->
    </div>
    <div class="main-deck-text-bar">
      <span class="main-deck-title">主卡组</span>
      <!-- <a target="_blank" href="http://www.takaratomy.co.jp/products/wixoss/rule/rule_mayu_room.html" id="main-deck-mayus-room">茧的房间</a> -->
      <!-- <span id="main-deck-burst"><span id="main-deck-burst-title">爆发:</span> -->
      <!-- <span id="main-deck-burst-count"></span><span>/20</span></span> -->
    </div>
    <div class="main-deck-zone">
      <DeckTemplate :deck="mainDeck"></DeckTemplate>
    </div>
    <div class="lrig-deck">
      <div class="lrig-deck-text-bar">
        <span class="lrig-deck-title">LRIG卡组</span>
      </div>
    <div class="lrig-deck-zone">
      <DeckTemplate :deck="lrigDeck"></DeckTemplate>
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
.dropmenu button {

}
.title-bar {
  float: left;
  height: auto;
  width: 100%;
  background: #d3d3d3;
  height: auto;
  border-radius: 5px 5px 0 0;
}
.deck-name {
  /*background-color: #c3c3c3;*/
  position: relative;
  float: left;
  /*height: .9em;*/
  text-align: center;
  width: 90%;
  margin: .2em 0;
}
.control {
  float: right;
  line-height: 1.7em;
  height: 100%;;
  color: #a3a3a5;
}
</style>