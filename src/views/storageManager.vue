<template>
	<div class="jibenxinxi">
		<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="storageHandleClick">
			<el-tab-pane
			    v-for="(item, index) in editableTabs"
			    :key="item.tagName"
			    :label="item.title"
			    :name="item.tagName">
			    
			    <storageInfoModal :storageInfoModalType="modalType" @close="modalClose" :storageInfo="item" @submit="modalSubmit"></storageInfoModal>
			</el-tab-pane>
			<!--<el-tab-pane label="[+添加库房]" name="addTab" ></el-tab-pane>-->
		</el-tabs>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import local from '../local.js'
	import storageInfoModal from './modals/storageInfoModal.vue'
	export default {
		mixins: [mixin],
		components: {storageInfoModal},
		data() {
			return {
				editableTabsValue: '0',
		        editableTabs: [],
		        user : local.get('sessionUser'),
		        tabIndex: 1,
			}
		},
		mounted() {
			this.refreashTab()
		},
		methods: {
			storageHandleClick(tab, event) {
				if(tab.name == "addTab") {
		    		this.addTab();
		    	}
			},
			addTab() {
		        let newTabName = 'Tab' + ++this.tabIndex;
		        this.editableTabs.push({
		          title: '新建库房',
		          tagName: newTabName,
		        });
		        this.editableTabsValue = newTabName;
		    },
		    removeTab(targetName) {
		    	this.$message({type: 'info', message: '该功能暂未开放'});
	    		return
		    	if(targetName == "addTab") {
		    		this.$message({type: 'info', message: '该页签不允许删除'});
		    		return
		    	}
		    	let tabs = this.editableTabs;
		    	if(targetName) {
		    		this.confirm('确定删除该库房？', (function() {
	        			var arr = [], o = {};
						let activeName = this.editableTabsValue;
				        if (activeName === targetName) {
				          	tabs.forEach((tab, index) => {
				            	if (tab.tagName === targetName) {
				            		if(tab.id)
				            			arr[0] = tab.id;
				              		let nextTab = tabs[index + 1] || tabs[index - 1];
				              		if (nextTab) {
				                		activeName = nextTab.tagName;
				              		}
				            	}
				          	});
				        }
				        
				        this.editableTabsValue = activeName;
				        this.editableTabs = tabs.filter(tab => tab.tagName !== targetName);
				        
				        if(arr.length > 0) {
				        	o.id = arr;
							o.enabled = 0;
							this._ajax({url: this.rootAPI + 'storage/update', param: o, arr:true})
							.then((function(d) {
								if(d.state == 0) {
									this.$message({type: 'success', message: '删除成功'});
								} else {
									this.$message({type: 'warning', message: '删除失败:'+d.msg});
								}
							}).bind(this))
				        }
	        		}).bind(this))
		    	}
		    },
		    refreashTab() {
		   		//刷新tab内容
		    	this._ajax({url: this.rootAPI, name: 'storage/list', param: {customerId : this.user.typeCode, enabled : 1}})
				.then((function(d) {
					console.info(d)
					let data = d.aaData;
					let storageData = [];
					var vm = this;
					$.each(data, function(i, obj) {
						obj.tagName = obj.id+'';
						obj.title = obj.name;
						storageData.push(obj);
						if(i == 0)
							vm.editableTabsValue = obj.tagName
					});
					this.editableTabs = storageData.reverse();
	            }).bind(this))
		   	},
		   	modalSubmit() {
		   		this.refreashTab();
		   	}
		}
	}
</script>