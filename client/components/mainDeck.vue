<template>
	<div>
	<mt-cell v-for="item in mainDeck">
	<div style="overflow: hidden; width: 170px; height: 170px; position:relative; margin:0.5em">
		  <img :src="item.img" style="margin-top: -40px; margin-left: -40px;" />
		</div>
		<div>
			<p>{{item.info.name}}</p>
			<p>
				<span>Lv.{{item.info.level}}</span>
				<span>{{item.info.power}}<span>
			</p>
			<p>
				<button>-</button>
				<span>{{item.count}}</span>
				<button>+</button>
			</p>
		</div>
	</mt-cell>
	</div>
</template>
<script>
export default {
  computed: {
    mainDeck() {
    	return this.$store.getters.mainDeck
    }
  }
}
</script>