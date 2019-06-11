<template>
	<div class="page-khNolice">
		<!--<div class="toubu_B">
			<span class="tliel_name">客户列表</span>
			<span class="addanniu">
			</span>
		</div>-->
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="账期类型">
						<selectInput :clearable='true' :value.sync="searchForm.termType" @selectChange="searchTable">
							<el-option v-for="item in dataDic.termTypeOption" :key="item.key" :label="item.value" :value="item.key">
							</el-option>
						</selectInput>
					</searchInputItem>
				</searchInputItems>
				
			</span>
			<searchInputItem name="商户名称">
				<inputItem :value.sync="searchForm.customerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-refresh" @click="lookOver" content="批量设置" type="success">批量设置</iconBtn>
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
			</span>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="100" label="序号">
			</el-table-column>
			<el-table-column prop="customerName" label="商户名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.customerName">
						<div>{{scope.row.customerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="termType" label="账期类型">
				<template slot-scope="scope">
					<selectInput :clearable='true' :value.sync="scope.row.termType" @selectChange="changObj(scope.row)">
						<el-option v-for="item in dataDic.termTypeOption" :key="item.key" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
				</template>
			</el-table-column>
			<el-table-column prop="termDays" label="账期天数">
				<template slot-scope="scope">
				     <el-input-number v-model="scope.row.termDays" :controls="false" @blur="changObj(scope.row)"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="remindDays" label="到期提醒天数">
				<template slot-scope="scope">
					<el-input-number v-model="scope.row.remindDays" :controls="false" @blur="changObj(scope.row)"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="isRemind" label="是否提醒">
				<template slot-scope="scope">
					<selectInput :clearable='true' :value.sync="scope.row.isRemind" @selectChange="changObj(scope.row)">
						<el-option v-for="item in dataDic.isRemindOption" :key="item.code" :label="item.name" :value="item.code">
						</el-option>
					</selectInput>
				</template>
			</el-table-column>
		</elemTable>
		<customermmappingModal :modal='customerGroupSetModal' @add='modalAdd' :dataDic="dataDic" v-if='customerGroupSetModal' @close='customerGroupSetModalClose' :ids='ids'></customermmappingModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import customermmappingModal from './modals/customermmappingModal.vue'
	export default {
		mixins: [mixin],
		components: {
			customermmappingModal
		},
		data() {
			return {
				searchForm: {
					termType: '',
					sellerId: '',
					customerName: ''
				},
				dataDic: {
					termTypeOption: [],
					isRemindOption: [{code:1,name:'是'},{code:0,name:'否'}],
				},
				userInfo:local.get('sessionUser'),
				dataList: [],
				modalShow: false,
				islookup: false,
				customerId:'',
				ids:[],
				customerGroupSetModal: false,
				buyerModal : false,
			}
		},
		mounted() {
			let user = local.get('sessionUser');
			this.customerId = parseInt(user.typeCode);
			this._searchDic('CUSTMAPP_STATUS')
			.then((function(d) {
				this.dataDic.termTypeOption = d.aaData//this._dicKey(d)
			}).bind(this))
			this.searchTable();
		},
		methods: {
			modalAdd(o) {
				this._ajax({
					url: this.rootAPI + "customertermmapping/updateBacth",
					param: o,
					arr: true
				}).then((function(d) {
					if(d.state == 0) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
					} else if(d.state == 1){
						this.$message({
							type: 'warning',
							message: d.msg
						});
					} else {
						this.$message({
							type: 'failure',
							message: '操作失败'
						});
					}
					this.$emit('submit')
				}).bind(this)).then(this.searchTable)
			},
			renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			},
			changObj(row){
//				console.info(row.termDays)
//				console.info(row.remindDays)
				let reg = /^\d+$/;
				if(!reg.test(row.termDays)) {
					this.$message({type: 'warning', message: '账期天数只能为正整数'});
					return;
				} else if(row.termDays > 50) {
					this.$message({type: 'warning', message: '账期天数不能大于50'});
					return;
				}
				if(!reg.test(row.remindDays)) {
					this.$message({type: 'warning', message: '账期提醒天数只能为正整数'});
					return;
				} else if(row.remindDays > 50) {
					this.$message({type: 'warning', message: '账期提醒天数不能大于50'});
					return;
				}
				if(row.remindDays > row.termDays) {
					this.$message({
						type: 'warning',
						message: '到期提醒天数不能大于账期天数'
					});
					return;
				}
				var url = 'customertermmapping/create';
				if(row.id && row.id > 0){
					url = 'customertermmapping/update';
				}
				this._ajax({
					url: this.rootAPI + url,
					param: row,
					arr: true
				}).then((function(d) {
				if(d.state == 0){
					this.$message({
						type: 'success',
						message: '操作成功'
					});
				}
				this.handleCurrentChange(1)
				}).bind(this))
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					sellerId: this.userInfo.typeCode
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customertermmapping/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					termType: '',
					customerName: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			customerGroupSetModalClose() {
				this.customerGroupSetModal = false;
			},
			lookOver() {
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.rowSelection
	        		var arr = []
					selection.forEach(function(el) {
						arr.push(el.buyerId)
					})
	            this.ids = arr;
				this.customerGroupSetModal = true;     		
	        	}
			},
		}
	}
</script>
<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 45px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 22px;
			}
			.addanniu {
				float: right;
			}
		}
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>