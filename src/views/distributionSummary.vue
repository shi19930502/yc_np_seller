<template>
	<div class="page-khNolice">
		
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="预计配送日期">
						<dateEditorDaterange type="date" :showShortcuts="showShortcuts" :dateValue.sync="distributionTimeBegin"  :dateRange='dateRange' ></dateEditorDaterange>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-plus" content="创建序列号" @click="createIndex">创建序列号</iconBtn>
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
		</div>
		
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="index" width="150" label="序号"/>-->
			<el-table-column prop="extendIndex" label="分拣序号">
				<template slot-scope="scope">
					<span>{{scope.row.extendIndex}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="buyerName" label="买方名称">
				<template slot-scope="scope">
					<span>{{scope.row.buyerName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="sellerName" label="卖方名称" >
				<template slot-scope="scope">
					<span>{{scope.row.sellerName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="orderTotal" label="需求总金额" >
				<template slot-scope="scope">
					<span v-if="scope.row.orderTotal != null">{{scope.row.orderTotal+ '元'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="sortingOrderTotal" label="分拣总金额">
				<template slot-scope="scope">
					<span v-if="scope.row.sortingOrderTotal != null">{{scope.row.sortingOrderTotal + '元'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单笔数">
				<template slot-scope="scope">
					<span>{{scope.row.orderCount}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="itemCount" label="明细笔数">
				<template slot-scope="scope">
					<span>{{scope.row.itemCount}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="255px">
				<template slot-scope="scope">
					<elBtn type="info" content="查看订单明细" @click="lookOver(scope.row)">查看订单明细</elBtn>
					<elBtn @click="print(scope.row)" @ctrlClick="printView(scope.row)">批量打印销货单</elBtn>	  
				</template>
			</el-table-column>
		</elemTable>
		<distributionSummaryModal ref='distributionSummary' :tableRow='tableRow'></distributionSummaryModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import distributionSummaryModal from './modals/distributionSummaryModal.vue'
	export default {
		mixins: [mixin],
		components: {
			distributionSummaryModal
		},
		data() {
			return {
				searchForm: {
					distributionTimeBegin: ''
				},
				dataDic: {
					tradingAreaList: []
				},
				dataList: [],
				distributionSummaryModal:false,
				tableRow:{},
				showShortcuts:false,
				exportDataList:[],
				distributionTimeBegin:''
			}
		},
		mounted() {
			this.searchTable();
			var aaa = R.add(2.11, 3.333)
		},
		methods: {
			createIndex() {
				if(this.distributionTimeBegin == null) {
					this.$message({
							type: 'warning',
							message: '请选择创建序号的时间'
					});
				}
				let user = local.get('sessionUser');
				this._ajax({
					url: this.rootAPI,
					name: 'buyerindex/createByIndexBySellerId',
					param: {
						sellerId : user.typeCode || 0,
						disDate : this.distributionTimeBegin.replace("-","/").replace("-","/")
					},
					loading: 'dataLoading'
				}).then((function(d) {
					if(d.state == 0) {
							this.$message({
							type: 'success',
							message: '创建成功'
						});
					}
					this.searchTable();
					
				}).bind(this))
			},
			searchTable() {
				if(this.distributionTimeBegin == null) {
					this.$message({
							type: 'warning',
							message: '请选择预计配送时间'
					});
				}
				if(this.distributionTimeBegin == '') {
					this.distributionTimeBegin = this.getTomorrow
				}
				this.searchForm.distributionTimeBegin = this.distributionTimeBegin.replace("-","-").replace("-","-")
				let user = local.get('sessionUser');
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'order/queryOrderTotalBySellerIdAndStatusEqualsTwo',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			lookOver(row) {
				this.tableRow = row;
				this.$refs.distributionSummary.show(row);
			},
			exportExcel() {
				this.exportDataList = [],
				this.searchForm.pageNum = ''
				this.searchForm.pageSize = ''
				this._ajax({
					url: this.rootAPI,
					name: 'order/queryOrderTotalBySellerIdAndStatusEqualsTwo',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then((function(d) {
					let data = d.aaData;
					this.exportDataList = data;
					var fields = ['extendIndex','buyerName', 'sellerName', 'orderTotal', 'sortingOrderTotal','orderCount','itemCount', 'distributionTimeBegin'],
					filedsName = ['分拣序号','买方名称', "卖方名称", "需求总金额", "分拣总金额",'订单笔数','订单明细笔数', '配送时间'],
					fileName = '待配送订单信息汇总';
					this._exportExcel(this.exportDataList, fields, filedsName, fileName)
				}).bind(this))
					
				
			},
			reset() {
				this.distributionTimeBegin = this._momentAddDay()
				this.searchForm.distributionTimeBegin = ''
				this.searchTable()
			},
			print(row) {
				this._ajax({name: 'order/listByUser', param: {
						distributionTimeBegin: this.distributionTimeBegin,
						distributionTimeEnd: this.distributionTimeBegin,
						sellerId: row.sellerId,
						buyerId:  row.buyerId,
					}})
					.then((function(d) {
						if(d.aaData.length > 0) {
							var arr = [], data = d.aaData
							data.forEach((function(el) {
								if(el.orderStatusId != '0' && el.orderStatusId != '6' && el.orderStatusId != '7') {
									arr.push(el)
								}
							}).bind(this))
							if(arr.length > 0) {
								var allItemList = []
								arr.forEach((function(el) {
									var itemList = el.orderitemList
									itemList.forEach((function(em) {
										allItemList.push(em)
									}).bind(this))
								}).bind(this))							
								var trs = ''
								var orderTotal = ''
				                var sortingOrderTotal = ''
			           	 		allItemList.forEach((function(em, index) {
			           	 			let _index = index + 1
				                    let skuName = em.skuName
				                    let productName = em.productName
				                    let skuCode = em.skuCode
				                    let price = ''
				                    if(em.price != null) {
				                    	price = em.price.div(100)
				                    }
				                    let quantity = em.quantity ? em.quantity + em.skuMeasureName : ''
				                    if(this.measureType(em)) {
					                    em.measureName = em.skuMeasureName
					                }else if(!this.measureType(em)) {
					                    em.measureName = em.baseMeasureName
					                }
				                    let sortingWeight = em.sortingWeight ? em.sortingWeight + em.measureName : ''
				                    let comment = em.comment ? em.comment : ''
				                    let sortingTotalForDecimal = em.sortingTotalForDecimal || ''
				                    let itemTotalForDecimal = em.itemTotalForDecimal || ''
				                    let itemHTML = this._renderPrintHtml(PRINT_HTML.ORDER_ITEM, _index, productName, skuName, price, quantity, sortingWeight, sortingTotalForDecimal, comment)
				                  	trs = trs + itemHTML
				                  	sortingOrderTotal = sortingOrderTotal.add(sortingTotalForDecimal)
				                  	orderTotal = orderTotal.add(itemTotalForDecimal)
			           	 		}).bind(this))
			           	 		var el = arr[0]
			           	 		var printHtml = ''
			           	 		var address = el.distributionType == 1 ? el.shippingAdd : '自提'
				                var distributionTime = ''
				                if(el.distributionTimeBegin) {
				            		if(el.distributionTimeBegin.split(":").length > 0) {
				            			distributionTime = distributionTime + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
				            		}else {
				            			distributionTime = distributionTime + el.distributionTimeBegin
				            		}	            		
				            	}
				            	if(el.distributionTimeEnd) {
				            		if(el.distributionTimeEnd.split(":").length > 0) {
				            			distributionTime = distributionTime + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
				            		}else {
				            			distributionTime = distributionTime + "-" + el.distributionTimeEnd
				            		}	            		
				            	}
				            	distributionTime = distributionTime ? distributionTime.split(' ')[0] : ''
				                var contacts = el.contacts || ''
				                
				                var sellerName = el.sellerName || ''
				                var buyerName = el.buyerName || ''
				                var orderUmber = el.orderUmber || ''
				                var buyerTel = el.buyerTel || ''
				                var sellerTel = el.sellerTel || ''
				                var customerIndex = el.customerIndex || ''
				                var marketTitle = this.$store.state.marketTitle || ''
				                var footer1 = '分拣员'
				                var footer2 = '配送员'
				                var footer3 = '验收人'
				                var footer4 = ''
				                var titleName = '销货单'
				                printHtml = printHtml + this._renderPrintHtml(PRINT_HTML.ORDER_MAIN, 
					                        marketTitle + titleName, 
					                        sellerTel, 
					                        orderUmber, 
					                        buyerName, 
					                        customerIndex, 
					                        contacts, 
					                        buyerTel, 
					                        address,
					                        distributionTime,
					                        trs,
					                        orderTotal,
					                        orderTotal,
					                        sortingOrderTotal,
					                        sortingOrderTotal,
					                        footer1,
					                        footer2,
					                        footer3)	
				                this.lodopoPrint('6%','5%','95%','100%',printHtml, allItemList.length)
							}
						}
					}).bind(this))
			},
			printView(row) {
				this._ajax({name: 'order/listByUser', param: {
						distributionTimeBegin: this.distributionTimeBegin,
						distributionTimeEnd: this.distributionTimeBegin,
						sellerId: row.sellerId,
						buyerId:  row.buyerId,
					}})
				.then((function(d) {
					if(d.aaData.length > 0) {
						var arr = [], data = d.aaData
						data.forEach((function(el) {
							if(el.orderStatusId != '0' && el.orderStatusId != '6' && el.orderStatusId != '7') {
								arr.push(el)
							}
						}).bind(this))
						if(arr.length > 0) {
							var allItemList = []
							arr.forEach((function(el) {
								var itemList = el.orderitemList
								itemList.forEach((function(em) {
									allItemList.push(em)
								}).bind(this))
							}).bind(this))							
							var trs = ''
							var orderTotal = ''
			                var sortingOrderTotal = ''
		           	 		allItemList.forEach((function(em, index) {
		           	 			let _index = index + 1
			                    let skuName = em.skuName
			                    let productName = em.productName
			                    let skuCode = em.skuCode
			                    let price = ''
			                    if(em.price != null) {
			                    	price = em.price.div(100)
			                    }
			                    let quantity = em.quantity ? em.quantity + em.skuMeasureName : ''
			                    if(this.measureType(em)) {
				                    em.measureName = em.skuMeasureName
				                }else if(!this.measureType(em)) {
				                    em.measureName = em.baseMeasureName
				                }
			                    let sortingWeight = em.sortingWeight ? em.sortingWeight + em.measureName : ''
			                    let comment = em.comment ? em.comment : ''
			                    let sortingTotalForDecimal = em.sortingTotalForDecimal || ''
			                    let itemTotalForDecimal = em.itemTotalForDecimal || ''
			                    let itemHTML = this._renderPrintHtml(PRINT_HTML.ORDER_ITEM, _index, productName, skuName, price, quantity, sortingWeight, sortingTotalForDecimal, comment)
			                  	trs = trs + itemHTML
			                  	sortingOrderTotal = sortingOrderTotal.add(sortingTotalForDecimal)
			                  	orderTotal = orderTotal.add(itemTotalForDecimal)
		           	 		}).bind(this))
		           	 		var el = arr[0]
		           	 		var printHtml = ''
		           	 		var address = el.distributionType == 1 ? el.shippingAdd : '自提'
			                var distributionTime = ''
			                if(el.distributionTimeBegin) {
			            		if(el.distributionTimeBegin.split(":").length > 0) {
			            			distributionTime = distributionTime + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
			            		}else {
			            			distributionTime = distributionTime + el.distributionTimeBegin
			            		}	            		
			            	}
			            	if(el.distributionTimeEnd) {
			            		if(el.distributionTimeEnd.split(":").length > 0) {
			            			distributionTime = distributionTime + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
			            		}else {
			            			distributionTime = distributionTime + "-" + el.distributionTimeEnd
			            		}	            		
			            	}
			            	distributionTime = distributionTime ? distributionTime.split(' ')[0] : ''
			                var contacts = el.contacts || ''
			                
			                var sellerName = el.sellerName || ''
			                var buyerName = el.buyerName || ''
			                var orderUmber = el.orderUmber || ''
			                var buyerTel = el.buyerTel || ''
			                var sellerTel = el.sellerTel || ''
			                var customerIndex = el.customerIndex || ''
			                var marketTitle = this.$store.state.marketTitle || ''
			                var footer1 = '分拣员'
			                var footer2 = '配送员'
			                var footer3 = '验收人'
			                var footer4 = ''
			                var titleName = '销货单'
			                printHtml = printHtml + this._renderPrintHtml(PRINT_HTML.ORDER_MAIN, 
					                        marketTitle + titleName, 
					                        sellerTel, 
					                        orderUmber, 
					                        buyerName, 
					                        customerIndex, 
					                        contacts, 
					                        buyerTel, 
					                        address,
					                        distributionTime,
					                        trs,
					                        orderTotal,
					                        orderTotal,
					                        sortingOrderTotal,
					                        sortingOrderTotal,
					                        footer1,
					                        footer2,
					                        footer3)
			                this.lodopoPreview('6%','5%','95%','100%',printHtml, allItemList.length)
						}
					}
				}).bind(this))
			},
			measureType(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1)) {
                    return 1
                }else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    return 0
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