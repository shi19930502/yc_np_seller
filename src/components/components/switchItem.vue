<template>
	<el-switch
      style="display: block"
      :value="value"
      active-color="#13ce66"
      inactive-color="#ff4949"
      :active-text="activeText"
      :inactive-text="inactiveText"
      :active-value='activeValue'
      :inactive-value='inactiveValue'
      :disabled="disabled"
      class='switchClass'
      @input='change'>
    </el-switch>
</template>
<script>
	export default {
		name: 'switchItem',
		props: {
			value: {
				default: true
			},
			activeValue: {
				default: 0
			},
			inactiveValue: {
				default: 1
			},
			activeText: {
				default: "是"
			},
			inactiveText: {
				default: "否"
			},
			disabled: {
				default: false
			}
		},
		methods: {
			change(val) {
				this.$emit('update:value', val)
			},
		}
	}
</script>
<style>
	.switchClass{
		margin-top: 3px;
	}
</style>