<template>
	<div>
	<div v-for="card in deck" class="card-item">
	<div class="card-img-div">
		  <img :src="card.img" class="card-img"/>
		</div>
		<div>
			<p>{{card.info.name}}</p>
			<p>
				<span>Lv.{{card.info.level}}</span>
				<span>{{card.info.power}}<span>
			</p>
			<p>
				<button>-</button>
				<span>{{card.count}}</span>
				<button>+</button>
			</p>
		</div>
	</div>
	</div>
</template>
<script>
export default {
	props:['deck'],
}
</script>
<style>
.card-item {
	height:6em;
}
.card-img-div {
	float: left;
	overflow: hidden;
	width: 170px;
	height: 170px;
	position:relative;
	margin:0.5em
}
.card-img {
	margin-top: -40px;
	margin-left: -40px;
}
</style>