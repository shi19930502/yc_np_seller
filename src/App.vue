<template>
  <div id='main' class="page-app">
    <router-view></router-view>  
  </div>
</template>
<script>
export default {
	async mounted() {
		// 每隔5分钟刷新一次字典表数据
		this.updateDatadic()
	},
	methods: {
		async updateDatadic() {
			await this.$store.dispatch('updateDatadic')
			setTimeout(this.updateDatadic, 1000 * 60 * 5)
		}
	},
	watch:{
	    $route(to,from){
	        if (!to.matched.length) {
	            this.$router.push('/404');
	        }
	    }
    }
}
</script>
<style lang="sass">
	.page-app{
		height: 100%;
	}
</style>
