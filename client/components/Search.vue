<script>
export default {

}
</script>

<template>
  <section id="Search">
    <input id="search-input" placeholder="输入关键字以搜索" spellcheck="false" autocomplete="off" autocapitalize="none">
    <div id="div-search-tips">
      <a id="link-search-tips" href="./SearchTips.html" target="_blank">搜索技巧</a>
    </div>
    <div id="div-search-results">
      <ol id="search-list"></ol>
      <div id="search-show-more" style="display: none;">显示更多</div>
    </div>
  </section>
</template>