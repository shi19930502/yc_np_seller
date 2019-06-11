<template>
	<div class="page-khNolice">
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="预计配送日期">
						<dateEditorDaterange type="date" :showShortcuts="showShortcuts" :dateValue.sync="distributionTimeBegin"  
						:dateRange='dateRange' :showPickerOptions="false"></dateEditorDaterange>
					</searchInputItem>
					<searchInputItem name="商品名称">
					<inputItem :value.sync="searchForm.productName" placeHolder="请输入商品名称"></inputItem>
					</searchInputItem>
					<searchInputItem name="规格名称">
						<inputItem :value.sync="searchForm.skuName" placeHolder="请输入规格名称"></inputItem>
					</searchInputItem>
					<searchInputItem name="是否时价" >
						<selectInput :value.sync="searchForm.isActualPrice" @selectChange="searchTable">
							<el-option v-for="item in dataDic.isActualPriceOptions" :key="item.key" :label="item.value" :value="item.key">
							</el-option>
						</selectInput>
					</searchInputItem>
			</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
			</span>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="150" label="序号">
			</el-table-column>
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<span>{{scope.row.productName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="skuName" label="规格名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.skuName">
						<span>{{scope.row.skuName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="totalQuantity" label="规格需求总量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.totalQuantity+scope.row.skuMeasureName">
						<span>{{scope.row.totalQuantity}}&nbsp;{{scope.row.skuMeasureName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="规格价格">
				<template slot-scope="scope">
					<inputItem :value.sync="scope.row.price" @change="changePrice(scope.row)"></inputItem>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					skuName: '',
					isActualPrice:1,
					productName:'',
					distributionTimeBegin: ''
				},
				dataDic: {
					tradingAreaList: [],
					isActualPriceOptions:[{key:1,value:'时价商品'},{key:0,value:'普通商品'}],
				},
				dataList: [],
				exportDataList: [],
				distributionTimeBegin: ''
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				if(this.distributionTimeBegin == '' || this.distributionTimeBegin == null) {
					this.distributionTimeBegin = this.getTomorrow;
				}
				var vm = this;
				return this._ajax({
					url: this.rootAPI,
					name: 'order/queryProductByRealTimePrice',
					param: {
						pageNum: vm.pageNum,
						pageSize: vm.pageSize,
						distributionTimeBegin: vm.distributionTimeBegin.replace("-", "-").replace("-", "-"),
						skuName:vm.searchForm.skuName,
						isActualPrice:vm.searchForm.isActualPrice,
						productName:vm.searchForm.productName
					},
					loading: 'dataLoading'
				}).then(this.renderTable)
				.then((function(){
					this.dataList.forEach((function(el){
						el.price = el.price / 100
					}).bind(this))
				}).bind(this))
			},
			reset() {
				this.distributionTimeBegin = '';
				this.searchForm.skuName = '';
				this.searchForm.isActualPrice = 1;
				this.searchForm.productName = '';
				this.searchTable();
			},
			changePrice(row) {
				let reg = /^[0-9]{1,10}(\.[0-9]{1,2})*$/;
				if(this.searchForm.isActualPrice == 0 && row.price == 0){
					this.$message({
						type: 'warning',
						message: '普通商品价格不能为 0!'
					});
					return;
				}
				if(!reg.test(row.price) || row.price <= 0 || row.price > 9999.99) {
					this.$message({
						type: 'warning',
						message: '请输入0.00~9999.99的商品价格'
					});
				} else {
//					this.confirm('确定保存商品价格？', (function() {
						this._ajax({
							url: this.rootAPI + 'order/updateProductPriceInOrderItem',
							param: {
								skuId:row.skuId,
								isActualPrice:this.searchForm.isActualPrice,
								price:row.price.mul(100),
								distributionTimeBegin: this.distributionTimeBegin.replace("-", "-").replace("-", "-")
							},
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '受理成功'
								});
								this.handleCurrentChange(1)
							} else {
								this.$message({
									type: 'success',
									message: '操作失败：' + d.msg
								});
							}
						}).bind(this))
//					}).bind(this))
//					this.searchTable();
				}
			}
		}
	}
</script>
<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 60px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 25px;
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