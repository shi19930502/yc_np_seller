<template>
	<div class="page-order-manage">
		<div v-loading="dataLoading">			
			<div class="inner-content">
				<div class="tab-box">
					<el-tabs v-model="tabActive" @tab-click="tabClick">
					    <el-tab-pane label="待受理" name="0"></el-tab-pane>
					    <el-tab-pane label="待分拣" name="1"></el-tab-pane>
					    <el-tab-pane label="待配送" name="2"></el-tab-pane>
					    <el-tab-pane label="配送中" name="3"></el-tab-pane>
					    <el-tab-pane label="已收货" name="4"></el-tab-pane>
					    <el-tab-pane label="已完成" name="5"></el-tab-pane>
					    <el-tab-pane label="已拒绝" name="6"></el-tab-pane>
					    <el-tab-pane label="已取消" name="7"></el-tab-pane>
					    <el-tab-pane label="已评价" name="8"></el-tab-pane>
					    <el-tab-pane label="全部" name="all"></el-tab-pane>
				  	</el-tabs>
				</div>
				<searchInputItems>
					<searchInputItem name="采购商">
						<inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
					</searchInputItem>
					<searchInputItem name="订单号">
						<inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
					</searchInputItem>
					<searchInputItem name="物流状态">
						<selectInput :clearable='true' :value.sync="searchForm.shippingStatusId" @selectChange="searchTable">
							<el-option
						      v-for="item in shippingStateList"
						      :key="item.key"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
					</searchInputItem>
					<searchInputItem name="支付状态">
						<selectInput :clearable='true' :value.sync="searchForm.paymentStatusId" @selectChange="searchTable">
							<el-option
						      v-for="item in paymentStateList"
						      :key="item.key"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
					</searchInputItem>
					<searchInputItem name="支付类型">
						<selectInput :clearable='true' :value.sync="searchForm.payType" @selectChange="searchTable">
							<el-option
						      v-for="item in payTypeList"
						      :key="item.key"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
					</searchInputItem>
					<searchInputItem name="配送方式">
						<selectInput :clearable='true' :value.sync="searchForm.distributionType" @selectChange="searchTable">
							<el-option
						      v-for="item in shippingMethodList"
						      :key="item.key"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
					</searchInputItem>
					<searchInputItem name="配送日期">
						<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
					</searchInputItem>
					<searchInputItem>
						<div style="width: 230px;" class="flex-x-end">
							<el-button-group>
								<elBtn iconClass="el-icon-plus" content="新增" type="success" @click="create">新建</elBtn>
								<elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
								<elBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</elBtn>
							</el-button-group>
						</div>					
					</searchInputItem>
				</searchInputItems>
				<div class="col-list">
					<el-row class="row-col-list">
						<el-col :span="showReview ? 11 : 13">
							<el-col :span="11">
								商品信息
							</el-col>
							<el-col :span="3">
								单价(元)
							</el-col>
							<el-col :span="5">
								数量
							</el-col>
							<el-col :span="5">
								小计
							</el-col>
						</el-col>
						<el-col :span="showReview ? 13 : 11">
							<el-col :span="8">
								客户
							</el-col>
							<el-col :span="showReview ? 6 : 8">
								总计
							</el-col>
							<el-col :span="6" v-if="showReview">
								评价
							</el-col>
							<el-col :span="showReview ? 4 : 8">
								状态
							</el-col>
						</el-col>
					</el-row>
				</div>
				<div class="sub-option flex-x-between">
					<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<!-- <div v-else></div> -->
					<el-button-group>
						<elBtn type="warning" @click="batchUpdateOrderState('1')" v-if="tabActive == 0">批量受理</elBtn>
						<elBtn type="warning" @click="batchUpdateOrderState('3')" v-if="tabActive == 2">批量发货</elBtn>
						<elBtn @click="batchPrint" v-if="tabActive == 2">批量打印销货单</elBtn>
						<elBtn @click="batchPrintSY" v-if="isShowDaYinSuYuanMa">批量打印溯源码</elBtn>
					</el-button-group>
				</div>
				<div class="order-info-list">
					<div class="order-info-item" v-for="item in dataList">
						<div class="top-ban flex-x-between">
							<div class="top-ban-left flex-y-center">
								<el-checkbox-group v-model="checkList" @change="handleCheckedChange">
									<el-checkbox :label="item.id"></el-checkbox>
								</el-checkbox-group>
								<span class="order-number">订单编号:{{item.orderUmber}}</span>
								<span class="order-create-date">创建时间:{{item.createdDate}}</span>	
							</div>
							<div class="top-ban-right flex-y-center">							   			
				    			<elBtn v-if="item.orderStatusId == 0" @click="updateOrderState(item, '1')">受理</elBtn>
				    			<elBtn v-if="(item.orderStatusId == 0 || item.orderStatusId == 1 || item.orderStatusId == 2 || item.orderStatusId == 3 || item.orderStatusId == 4)" @click="delOrder(item)">删除</elBtn>
				    			<elBtn v-if="item.orderStatusId == 0" @click="orderRefuse(item, '6')">拒绝</elBtn>
				    			<elBtn v-if="item.orderStatusId == 1" @click="orderSort(item)">分拣</elBtn>
				    			<elBtn v-if="item.orderStatusId == 2 && (item.distributorId === null || !item.distributorId) && item.distributionType == 1" @click="selectDistributor(item)">发货</elBtn>
				    			<elBtn v-if="item.orderStatusId == 2 && item.distributorId != null && item.distributorId
				    			 && item.distributionType == 1"
				    				@click="invoke(item)">撤销配送</elBtn>
				    			<elBtn v-if="item.orderStatusId == 2 && item.distributionType == 0" @click="deliverOrder(item)">发货</elBtn>
				    			<elBtn v-if="item.orderStatusId == 3 && (item.distributorId === null || !item.distributorId)" @click="orderDetail(item)">收货</elBtn>
				    			<elBtn v-if="item.orderStatusId == 4 && item.paymentStatusId == 0" @click="checkOrder(item, '5')">现金支付</elBtn>
				    			<elBtn v-if="item.orderStatusId == 4 && item.paymentStatusId == 0" @click="orderCredic(item)">赊销</elBtn>
				    			<elBtn v-if="item.orderStatusId == 5 && item.paymentStatusId == 1 && item.payType == 6" @click="orderCredicConfirm(item)">收款</elBtn>
				    			<elBtn v-if="item.orderStatusId == 8 && item.paymentStatusId == 1 && item.payType == 6" @click="orderCredicConfirm(item)">收款</elBtn>
				    			<elBtn v-if="item.orderStatusId == 8 && item.paymentStatusId == 0" @click="checkOrder(item, '8')">收款</elBtn>
							</div>
						</div>
						<div class="content">
							<el-row class="flex">
								<el-col :span="showReview ? 11 : 13" class="order-item-list" style="position: relative;">
									<el-col :span="24" class="order-item" v-for="(orderItem, index) in item.orderitemList" v-if="(index == 0 && item.rowCollapse) || !item.rowCollapse">
										<el-col :span="11">
											<div class="flex-x-start order-item-pic">
												<div class="order-pic-box">
													<img class="resp-img order-img" style="width: 72px;height: 72px;max-width: 100%;" :src="orderImg(orderItem)" @click="orderDetail(item)" @error="imgLoad">
												</div>
												<div class="name-box">
													<div class="pro-name word-break">
														<span>{{orderItem.productName}}</span>												
													</div>
													<div class="sku word-break">
														<span class="sku-label">规格:</span>
														<span class="sku-name">{{orderItem.skuName}}</span>
														<span class="sku-measure-label">计量单位:</span>													
														<span class="sku-measure-name">{{orderItem.skuMeasureName}}</span>
													</div>
													<div class="comment word-break">
														<span>买家备注:</span>
														<span class="comm">{{orderItem.comment || '--'}}</span>
													</div>
												</div>
											</div>
										</el-col>
										<el-col :span="3">
											<div class="item-price word-break">
												<div class="order-item-price">
													<span class="price">{{orderItem.priceForDecimal}}</span>
												</div>
											</div>
										</el-col>
										<el-col :span="5">
											<div class="order-number">
												<div class="order-number-item word-break">
													<span>订单数量:</span>
													<span class="order-quantity" v-if="orderItem.quantity || orderItem.quantity == 0">{{orderItem.quantity}}</span>
													<span class="order-quantity" v-else>--</span>
												</div>
												<div class="order-number-item word-break">
													<span>成交数量:</span>
													<span class="order-sort-weight" v-if="orderItem.sortingWeight || orderItem.sortingWeight == 0">{{orderItem.sortingWeight}}</span>
													<span class="order-sort-weight" v-else>--</span>
												</div>
												<div class="order-number-item word-break">
													<span>称重数量:</span>
													<span class="order-inspect-weight" v-if="orderItem.inspectedWeight || orderItem.inspectedWeight == 0">{{orderItem.inspectedWeight}}</span>
													<span class="order-inspect-weight" v-else>--</span>
												</div>
											</div>
										</el-col>
										<el-col :span="5">
											<div class="item-total">
												<div class="order-item-total word-break">
													<span>￥{{orderItem.itemTotalForDecimal || '--'}}</span>
												</div>
												<div class="order-sort-total word-break">
													<span>￥{{orderItem.sortingTotalForDecimal || '--'}}</span>
												</div>
												<div class="order-inspect-total word-break">
													<span>￥{{orderItem.inspectedTotalForDecimal || '--'}}</span>
												</div>
											</div>
										</el-col>
									</el-col>								
									<el-col :span="24" class="ban-bottom">
										<span v-if="Array.isArray(item.orderitemList) && item.orderitemList.length === 1">共1件商品</span>
										<span class="row-collapse" @click="rowUnCollapse(item)" v-else-if="Array.isArray(item.orderitemList) && item.orderitemList.length > 1 && item.rowCollapse">展开全部{{item.orderitemList.length}}件商品</span>
										<span class="row-un-collapse" @click="rowCollapse(item)" v-else-if="Array.isArray(item.orderitemList) && item.orderitemList.length > 1 && !item.rowCollapse">收起</span>
									</el-col>								
								</el-col>
								<el-col :span="showReview ? 13 : 11" class="order-info">
									<el-col :span="8" class="order-customer">
										<div class="buyer-name word-break">
											<span>{{item.buyerName || '--'}}</span>
										</div>
										<div class="buyer-tel word-break">
											<span>联系电话:</span>
											<span>{{item.buyerTel || '--'}}</span>
										</div>
										<div class="deliver-time word-break">
											<span>配送时间:</span>
											<span>{{item.distributionTime || '--'}}</span>
										</div>
										<div class="address word-break">										
											<span>配送地址:</span>
											<span>{{item.shippingAdd || '--'}}</span>																				
										</div>
										<div class="order-comment word-break">
											<span>留言:</span>
											<span>{{item.comment || '--'}}</span>
										</div>
									</el-col>
									<el-col :span="showReview ? 6 : 8" class="order-total">
										<div class="order-qu-total word-break">
											<span>订单金额:</span>
											<span>￥{{_priceFormat(item.orderTotal) || '--'}}</span>
										</div>
										<div class="order-sort-total word-break">
											<span>成交金额:</span>
											<span>￥{{_priceFormat(item.sortingOrderTotal) || '--'}}</span>
										</div>
										<div class="order-inspect-total word-break">
											<span>实付金额:</span>
											<span>￥{{_priceFormat(item.inspectedOrderTotal) || '--'}}</span>
										</div>
									</el-col>
									<el-col :span="6" class="order-review" v-if="showReview">									
										<div class="review-list" v-if="item.reviewscoreList && item.reviewscoreList.length > 0">
											<div class="review-item flex-y-center">
												<span class="avg-score-label score-label">综&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合:</span>
												<el-rate :value="reviewScoreAvg(item.reviewscoreList)" :max="5" :allow-half="false" :disabled="true" :show-text="false" :show-score="false"></el-rate>
											</div>
											<div class="review-item flex-y-center" v-for="rev in item.reviewscoreList">
												<span class="score-label">{{rev.reviewName}}:</span>
												<el-rate :value="rev.score/20" :max="5" :allow-half="false" :disabled="true" :show-text="false" :show-score="false"></el-rate>
											</div>
										</div>
										<div class="review-item" v-else>
											--
										</div>
									</el-col>
									<el-col :span="showReview ? 4 : 8" class="order-state">
										<div class="item-state">{{item.orderStatusName || '--'}}</div>
										<div class="item-detail" @click="orderDetail(item)">订单详情</div>
									</el-col>
								</el-col>
							</el-row>
						</div>
					</div>
				</div>						
			</div>
			<div class="flex-x-end page-pagination">
		      <el-pagination
		        @size-change="handleSizeChange"
		        @current-change="_handleCurrentChange"
		        :current-page="currentPage"
		        :page-sizes="pageSizes"
		        :page-size="pageSize"
		        layout="total, sizes, prev, pager, next, jumper"
		        :total="pageTotal">
		      </el-pagination>
			</div>
		</div>		
		<orderItemsModal v-if="modalShow" :modal="modalShow" @close="modalClose" :params="modalParams" @submit="modalSubmit"></orderItemsModal>
		<distributorListModal v-if="distributorListModal" :modal="distributorListModal" @close="distributorListModalClose" @submit="distributorListModalSubmit" :params="distributorListModalParams" title="选择配货商"></distributorListModal>
		<orderRefuseModal v-if="orderRefuseModal" :modal="orderRefuseModal" @close="orderRefuseModalClose" @submit="orderRefuseModalSubmit" :params="orderRefuseModalParams"></orderRefuseModal>
		<orderCreateModal v-if="orderCreateModal" :modal="orderCreateModal" @close="orderCreateModalClose" @submit="orderCreateModalSubmit"></orderCreateModal>
		<payTypeModal v-if="payTypeModal" :modal="payTypeModal" @close="payTypeModalClose" @submit="payTypeModalSubmit" :params="payTypeModalParams"></payTypeModal>
		<checkBillModal v-if="checkBillModal" :modal="checkBillModal" @close="checkBillModalClose" @submit="checkBillModalSubmit" :params="checkBillModalParams" :state="checkBillState"></checkBillModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import local from '../local.js'
	import orderItemsModal from './modals/orderItemsModal.vue'
	import distributorListModal from './modals/distributorListModal.vue'
	import orderProductColTmp from './tmp/orderProductCol.vue'
	import orderRefuseModal from './modals/orderRefuseModal.vue'
	import orderCreateModal from './modals/orderCreateModal.vue'
	import payTypeModal from './modals/payTypeModal.vue'
	import checkBillModal from './modals/checkBill.vue'
	import configs from '../configs.js'
	export default {
		mixins: [mixin],
		components: {orderItemsModal, distributorListModal, orderProductColTmp, orderRefuseModal, orderCreateModal, payTypeModal, checkBillModal},
		data() {
			return {
				checkAll: false,
				checkList: [],
				pageSizes:[10,20,30,40],
				pageSize: 10,
				checked: false,
				searchForm: {
					buyerName: '',
					orderUmber: '',
					orderStatusId: '0',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionType: 1,
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				},
				orderStateList:[],
				shippingStateList: [],
				paymentStateList: [],
				payTypeList: [],
				shippingMethodList: [],
				dataList: [],
				dateRange: [],
				distributorListModal: false,
				distributorListModalParams: {},
				tabActive: '0',
				orderRefuseModal: false,
				orderRefuseModalParams: {},
				orderCreateModal: false,
				loading: false,
				payTypeModal: false,
				checkBillModal: false,
				payTypeModalParams: {},
				checkBillModalParams: {},
				pageFixed: false,
				checkBillState: '',
			}
		},
		mounted() {
			if(typeof this.$route.params.tabActive === 'string') {
				this.tabActive = this.$route.params.tabActive
			}
			var disEndDate = this._momentAddDay()
			var disBegainDate = this._momentSubDay({
				days: 14
			})
			this.dateRange = [disBegainDate, disEndDate]
			Object.assign(this.searchForm, {
				orderStatusId: this.tabActive
			})
			this._searchDic('ORDER_STATUS')
			.then((function(d) {
				this.orderStateList = this._dicKey(d)
			}).bind(this))
			this._searchDic('TRANSPORT_STATUS')
			.then((function(d) {
				this.shippingStateList = this._dicKey(d)
			}).bind(this))
			this._searchDic('PAY_STATUS')
			.then((function(d) {
				this.paymentStateList = this._dicKey(d)
			}).bind(this))
			this._searchDic('PAY_WAY')
			.then((function(d) {
				this.payTypeList = this._dicKey(d)
			}).bind(this))
			this._searchDic('SHIPPING_METHOD')
			.then((function(d) {
				this.shippingMethodList = this._dicKey(d)
			}).bind(this))
			this.searchTable()
			
		},
		computed: {
			showReview() {
				if(this.tabActive == 5 || this.tabActive == 8 || this.tabActive == 'all') {
					return true
				}else {
					return false
				}
			},
			isShowDaYinSuYuanMa() {
				if(this.tabActive == 0 || this.tabActive == 6 ||this.tabActive == 7 ||  this.tabActive == 1){
					return false;
				}else {
					return true;
				}
			}
		},
		methods: {
			searchTable() {
				this.rowSelection = []
				this.checkList = []
				this.checkAll = false				
				var dateRange = {
					distributionTimeBegin: '',
					distributionTimeEnd: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						distributionTimeBegin: this.dateRange[0],
						distributionTimeEnd: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({name: 'order/listByUser', param: this.searchForm, loading: 'dataLoading'})
						   .then(this.renderTable)
			},
			handleDataList(d) {
				return d.aaData.map(function(el) {
					var str = ""
	            	if(el.distributionTimeBegin) {
	            		if(el.distributionTimeBegin.split(":").length > 0) {
	            			str = str + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
	            		}else {
	            			str = str + el.distributionTimeBegin
	            		}	            		
	            	}
	            	if(el.distributionTimeEnd) {
	            		if(el.distributionTimeEnd.split(":").length > 0) {
	            			str = str + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
	            		}else {
	            			str = str + "-" + el.distributionTimeEnd
	            		}	            		
	            	}
	            	el.distributionTime = str
	            	el.rowCollapse = true
	                return el
	            })
			},
			_handleCurrentChange(val) {
				$('html, body').animate({scrollTop: 0}, 0);
				console.log(this.rowSelection)
				this.handleCurrentChange(val)
			},
			reset() {
				Object.assign(this.searchForm, {
					buyerName: '',
					orderUmber: '',
					shippingStatusId: '',
					paymentStatusId: '',
					payType: '',
					distributionTimeBegin: '',
					distributionTimeEnd: '',
					distributionType: 1,
				})
				var disEndDate = this._moment()
				var disBegainDate = this._momentSubDay({
					days: 14
				})
				this.dateRange = [disBegainDate, disEndDate]	
				this._handleCurrentChange(1)
			},
			orderSort(row) {
				if(row.orderStatusId == 1) {
					var itemList = row.orderitemList
					var arr = []
					if(Array.isArray(itemList)) {
						itemList.forEach((function(el) {
							var batchId = el.batchId
							if(!batchId) {
								arr.push(el.productName)
							}
						}).bind(this))						
					}
					if(arr.length > 0) {
						this.confirm('系统检测到部分商品没有进场登记信息，请确认。 ', (function() {
							this._go('inMarketDetail')
						}).bind(this))
					}else {
						this.orderDetail(row)
					}
				}else {
					this.orderDetail(row)
				}
			},
			orderDetail(row) {
				this.modalEdit(row)				
			},
			updateOrderState(row, state) {
				var o = {}
				Object.assign(o, row)
				Object.assign(o, {
					orderStatusId: state
				})		
				if(state === '1') {
					var ids = [o.id]
					this._batchUpdateOrderState(ids, state, 'dataLoading')
					.then(this.searchTable) 
				}else {
					if(state === '3' && row.distributionType == 1) {
						var sessionUser = local.get('sessionUser')
						var customerId = sessionUser.typeCode
						this._customerById(customerId)
						.then((function(d) {
							if(d.aaData.length > 0) {
								var customer = d.aaData[0]
								if(customer.isDistribution == 1) {
									Object.assign(o, {
				                        distribute: 1,
				                        distributorId: customer.id,
				                        orderStatusId: '2'
				                    })
				                    this._updateOrder(o, 'dataLoading')
										.then(this.searchTable)
								}else {
									Object.assign(o, {
										shippingStatusId: '1'
									})
									this._updateOrder(o, 'dataLoading')
										.then(this.searchTable)
								}
							}
						}).bind(this))	
					}else if(state === '3') {
						Object.assign(o, {
							shippingStatusId: '1'
						})
						this._updateOrder(o, 'dataLoading')
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}
					if(state === '4') {
						Object.assign(o, {
							shippingStatusId: '2'
						})
						this._updateOrder(o, 'dataLoading')
							// .then((function(d) {
							// 	if(d && d.state === 0) {
							// 		this.$message({type: 'success', message: '操作完成'})
							// 	}
							// }).bind(this))
							.then(this.searchTable)
					}
					if(state === '5') {
						this.checkBillModalParams = row
						this.checkBillState = state
						this.checkBillModal = true

						// Object.assign(o, {
						// 	paymentStatusId: '1'
						// })
						// this._updateOrder(o, 'dataLoading')
						// 	// .then((function(d) {
						// 	// 	if(d && d.state === 0) {
						// 	// 		this.$message({type: 'success', message: '操作完成'})
						// 	// 	}
						// 	// }).bind(this))
						// 	.then(this.searchTable)
					}
					if(state === '8') {
						this.checkBillModalParams = row
						this.checkBillState = state
						this.checkBillModal = true
						// Object.assign(o, {
						// 	paymentStatusId: '1'
						// })
						// this._updateOrder(o, 'dataLoading')
						// 	// .then((function(d) {
						// 	// 	if(d && d.state === 0) {
						// 	// 		this.$message({type: 'success', message: '操作完成'})
						// 	// 	}
						// 	// }).bind(this))
						// 	.then(this.searchTable)
					}					
					if(state === '9') {
						this.confirm('确定删除订单:' + row.orderUmber + '?', (function() {
							this._updateOrder(o, 'dataLoading')
								.then(this.searchTable)
						}).bind(this))
						
					} 
				} 
			},
			checkOrder(row, state) {
				this.checkBillModalParams = row
				this.checkBillState = state
				this.checkBillModal = true
			},
			delOrder(row) {
				var o = {}
				Object.assign(o, {
					id: row.id,
					orderStatusId: '9'
				})		
				this.confirm('确定删除订单:' + row.orderUmber + '?', (function() {
					this._updateOrder(o, 'dataLoading')
						.then(this.searchTable)
				}).bind(this))
			},
			orderCredic(row) {
				var o = {}
				Object.assign(o, row)
				Object.assign(o, {
					orderStatusId: "5",
					paymentStatusId: '1',
					payType: "6"
				})
				this._updateOrder(o, 'dataLoading').then(this.searchTable)
			},
			orderCredicConfirm(row) {
				this.payTypeModalParams = row
				this.payTypeModal = true
			},
			batchUpdateOrderState(state) {
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择'});
	        	}else {
	        		let selection = this.rowSelection
	        		var arr = [], arr1 = [], arr2 = [], arr3 = []
					selection.forEach(function(el) {
						if(el.distribute == null && el.distributorId == null) {
							if(el.distributionType == 1) {
								arr1.push(el.id)
							}else {
								arr2.push(el.id)
							}							
						}
						arr.push(el.id)						
					})
					arr3 = arr1.concat(arr2)
					if(state === '1') {
						this._batchUpdateOrderState(arr, state, 'dataLoading')	
	        				.then(this.searchTable) 
					}else if(state === '3'){
						this.countSortingWeightNull(arr3, (function() {
							var sessionUser = local.get('sessionUser')
							var customerId = sessionUser.typeCode
							this._customerById(customerId)
							.then((function(d) {
								if(d.aaData.length > 0) {
									var customer = d.aaData[0]
									if(customer.isDistribution == 1) {
										var o = {
											distribute: 1,
					                        distributorId: customer.id,
										}
										if(arr1.length > 0) {
											this._batchUpdateOrderStates(arr1, o, 'dataLoading')
												.then((function(d) {
													if(arr2.length > 0) {
														var p = {
															shippingStatusId: '1',
									                        orderStatusId: state
														}
														return this._batchUpdateOrderStates(arr2, p, 'dataLoading')
													}
												}).bind(this))
												.then(this.searchTable)
										}else {
											if(arr2.length > 0) {
												var p = {
													shippingStatusId: '1',
							                        orderStatusId: state
												}
												this._batchUpdateOrderStates(arr2, p, 'dataLoading')
													.then(this.searchTable)
											}
										}
										
									}else {
										var o = {
											shippingStatusId: '1',
					                        orderStatusId: state
										}
										if(arr3.length > 0) {
											this._batchUpdateOrderStates(arr3, o, 'dataLoading')
												.then(this.searchTable)
										}									
									}
								}
							}).bind(this))
						}).bind(this))	
					}
	        	}
			},
			selectable(row, index) {
				return false
				if(row.orderStatusId == 0 && row.orderUmber.indexOf('ON-2') == -1) {
					return false
				}else if(row.orderStatusId == 2){
					return false
				}else {
					return true
				}				
			},
			selectDistributor(row) {
				this.countSortingWeightNull([row.id], (function() {
					var sessionUser = local.get('sessionUser')
					var customerId = sessionUser.typeCode
					this._customerById(customerId)
						.then((function(d) {
							if(d.aaData.length > 0) {
								var customer = d.aaData[0]
								if(customer.isDistribution == 1) {
									var o = {}
									Object.assign(o, row)
									Object.assign(o, {
										distribute: 1,
					                    distributorId: row.sellerId
									})
									var itemList = row.orderitemList
									var arr = []
									if(Array.isArray(itemList)) {
										itemList.forEach((function(el) {
											var batchId = el.batchId
											if(!batchId) {
												arr.push(el.productName)
											}
										}).bind(this))						
									}
									if(arr.length > 0) {
										this.confirm('系统检测到部分商品没有进场登记信息，请确认。 ', (function() {
											this._go('inMarketDetail')
										}).bind(this))
									}else {
										this._updateOrder(o, 'dataLoading')
											.then((function(d) {
												if(d && d.state === 0) {
													this.$message({type: 'success', message: '操作完成'})
												}
												this.searchTable()
											}).bind(this))
									}
								}else {
									this.deliverOrder(row)									
								}
							}
						}).bind(this))
				}).bind(this))												
			},
			deliverOrder(row) {
				this.countSortingWeightNull([row.id], (function() {
					if(row.orderStatusId == 2) {
						var itemList = row.orderitemList
						var arr = []
						if(Array.isArray(itemList)) {						
							itemList.forEach((function(el) {
								var batchId = el.batchId
								if(!batchId) {
									arr.push(el.productName)
								}
							}).bind(this))						
						}
						if(arr.length > 0) {
							this.confirm('系统检测到部分商品没有进场登记信息，请确认。 ', (function() {
								this._go('inMarketDetail')
							}).bind(this))
						}else {
							this.updateOrderState(row, '3')
						}
					}else {
						this.updateOrderState(row, '3')
					}
				}).bind(this))
			},
			distributorListModalClose() {
				this.distributorListModal = false
				this.distributorListModalParams = {}
			},
			distributorListModalSubmit() {
				this.distributorListModalClose()
				this.searchTable()
			},
			tabClick(tab, event) {
				this.checkList = []
				this.rowSelection = []
				this.dataList = []
				this.pageTotal = 0
				var val = this.tabActive === 'all' ? '' : this.tabActive
				Object.assign(this.searchForm, {
					orderStatusId: val
				})
				if(val == 2) {
					Object.assign(this.searchForm, {
						orderField: 'fenjiantime'
					})
				}else {
					Object.assign(this.searchForm, {
						orderField: ''
					})
				}
				this._handleCurrentChange(1)
			},
			orderRefuse(row, state) {
				Object.assign(this.orderRefuseModalParams, row, {
					state: state
				})
				this.orderRefuseModal = true
			},
			orderRefuseModalClose() {
				this.orderRefuseModal = false
				this.orderRefuseModalParams = {}
			},
			orderRefuseModalSubmit() {
				this.orderRefuseModalClose()
				this.searchTable()
			},
			create() {
				this.orderCreateModal = true
			},
			orderCreateModalClose() {
				this.orderCreateModal = false
			},
			orderCreateModalSubmit() {
				this.orderCreateModalClose()
				this.searchTable()
			},
			batchPrint() {				
				if(this.rowSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择'});
	        	}else {       		
               	 	this.rowSelection.forEach((function(el) {
               	 		var itemList = el.orderitemList
               	 		var printHtml = ''
               	 		var trs = ''
               	 		itemList.forEach((function(em, index) {
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
		                    let itemHTML = `
		                        <tr>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${_index}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${skuName}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${price}</td>
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quantity}</td> 
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingWeight}</td> 
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${sortingTotalForDecimal}</td>    
		                            <td style="text-align: center; border: solid 1px black;word-break:break-word;">${comment}</td>                  
		                        </tr>
		                    `
		                  	trs = trs + itemHTML
               	 		}).bind(this))
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
		                var contacts = el.contacts || ''
		                var orderTotal = ''
		                if(el.orderTotal != null) {
		                	orderTotal = el.orderTotal.div(100)
		                }
		                var sortingOrderTotal = ''
		                if(el.sortingOrderTotal != null) {
		                	sortingOrderTotal = el.sortingOrderTotal.div(100)
		                }
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
		                printHtml = printHtml + `
		                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 17px;">
		                        <span>${marketTitle}(${sellerName})${titleName}</span>                                    
		                    </div>
		                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
		                        <span style="position: absolute;right: 0;">订单号: ${orderUmber}</span>                                     
		                    </div>
		                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
		                        <span style="position: absolute;left: 0;">购货单位: ${buyerName}</span>
		                        <span style="position: absolute;right: 0;">分件编码: ${customerIndex}</span>                                    
		                    </div>
		                    <div style="position: relative;min-height: 20px;font-size: 13px;">
                                <div style="text-align: left;word-break:break-all;padding-right: 180px;">收货人: ${contacts}</div>      
                                <div style="position: absolute;right: 0;top: 0;">收货人电话: ${buyerTel}</div>                                    
                            </div>
                            <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                                <span style="position: absolute;left: 0;">配送时间: ${distributionTime}</span>
                            </div>
                            <div style="font-size: 13px;word-break:break-all;">
                                配送地址: ${address}
                            </div>
		                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
		                      <thead style="font-size:14px;">
		                          <tr>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>	                          
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">单价(元)</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">下单量</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣合计(元)</th>
		                              <th style="text-align: center; border: solid 1px black;word-break:break-word;">客户备注</th>
		                          </tr>
		                      </thead>
		                      ${trs}
		                    </table>
		                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
		                    	<span>打印合计总额(元): ${orderTotal}</span>
		                        <span>订单总额(元): ${orderTotal}</span>
		                        <span>打印合计实配金额(元): ${sortingOrderTotal}</span>
		                        <span>实配金额(元): ${sortingOrderTotal}</span>                                    
		                    </div>
		                    <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
		                        <span style="width: 25%;display: inline-block;">${footer1}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer2}: </span>
		                        <span style="width: 25%;display: inline-block;">${footer3}: </span>  
		                        <span style="width: 25%;display: inline-block;">${footer4}: </span>                                        
		                    </div>
		                    <div style="page-break-after: always;"></div>
		                `	
		                this.lodopoPrint('6%','5%','95%','100%',printHtml, itemList.length)	                
               	 	}).bind(this))
	        	}                
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
            invoke(row) {
				this.confirm('确定撤销配送？', (function() {
					var o = {
						id: [row.id]
					}
					this._ajax({
							url: this.rootAPI + 'order/invoke',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '撤销成功'
								});
							}else if(d.state == 2){
								this.$message({
									type: 'warning',
									message: d.msg
								});
							}
							
							this._handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
				this.searchTable();
			},
			payTypeModalClose() {				
				this.payTypeModal = false
				this.payTypeModalParams = {}
			},
			checkBillModalClose() {
				this.checkBillModal = false
				this.checkBillModalParams = {}
			},
			payTypeModalSubmit() {
				this.payTypeModalClose()
				this.searchTable();
			},
			checkBillModalSubmit() {
				this.checkBillModalClose()
				this.searchTable();
			},
			returnImgURL(rowItem) {
				if(rowItem) {
					if(rowItem.productPicUrl) {
						return rowItem.productPicUrl
					}else {
						return rowItem.skuPicUrl
					}
				}else {
					return ''
				}
			},
			orderUmberClick(item){
				item.rowChecked = !item.rowChecked
			},
			handleCheckAllChange(val) {
				this.rowSelection = []
				this.checkList = []
				if(val) {
					this.dataList.forEach((function(el) {
						this.checkList.push(el.id)
						this.rowSelection.push(el)						
					}).bind(this))
				}
			},
			handleCheckedChange(value) {
				this.rowSelection = []
				if(this.dataList.length != value.length) {
					this.checkAll = false
				}else {
					this.checkAll = true
				}
				this.checkList = value
				this.dataList.forEach((function(el) {
					this.checkList.forEach((function(em) {
						if(el.id === em) {
							this.rowSelection.push(el)
						}
					}).bind(this))						
				}).bind(this))
			},
			orderImg(orderitem) {
				var picUrl = '../../lib/img/pro-default.png'
				if(orderitem.skuPicUrl) {
					picUrl = configs.imgURL + orderitem.skuPicUrl
				}else if(orderitem.productPicUrl) {
					picUrl = configs.imgURL + orderitem.productPicUrl
				}
				return picUrl
			},
			imgLoad() {
				var target = arguments[0].target
				arguments[0].target.src = 'dist/pro-default.png'
			},
			rowUnCollapse(item){
				item.rowCollapse = false
				// this.$nextTick((function () {
			 //        $('.order-info-item').each(function(index, el) {
				// 		var h = $(el).find('.order-item-list').height()
				// 		$(el).find('.order-info').find('.order-customer').innerHeight(h)
				// 		$(el).find('.order-info').find('.order-total').innerHeight(h)
				// 		$(el).find('.order-info').find('.order-review').innerHeight(h)
				// 		$(el).find('.order-info').find('.order-state').innerHeight(h)
				// 	});
		  //     	}).bind(this))				
			},
			rowCollapse(item){
				item.rowCollapse = true
				// this.$nextTick((function () {
			 //        $('.order-info-item').each(function(index, el) {
				// 		var h = $(el).find('.order-item-list').height()
				// 		$(el).find('.order-info').find('.order-customer').innerHeight(176)
				// 		$(el).find('.order-info').find('.order-total').innerHeight(176)
				// 		$(el).find('.order-info').find('.order-review').innerHeight(176)
				// 		$(el).find('.order-info').find('.order-state').innerHeight(176)
				// 	});
		  //     	}).bind(this))
			},
			reviewScoreAvg(list) {
				var avg = 0
				list.forEach((function(el) {
					avg = avg + el.score
				}).bind(this))
				avg = Math.ceil(avg/60)
				return avg
			},
			handleLongText(str, num) {
				var res = ''
				if(str && str.length > num) {
					res = str.slice(0, num) + '...'
				}else {
					res = str
				}
				return res
			},
			_renderAgain() {
				// $('.order-info-item').each(function(index, el) {
				// 	var h = $(el).find('.order-item-list').height()
				// 	$(el).find('.order-info').find('.order-customer').innerHeight(176)
				// 	$(el).find('.order-info').find('.order-total').innerHeight(176)
				// 	$(el).find('.order-info').find('.order-review').innerHeight(176)
				// 	$(el).find('.order-info').find('.order-state').innerHeight(176)
				// });
				var winH = $(window).innerHeight()
				var pageH = $('.inner-content').outerHeight() + 52
				if(pageH > (winH - 177)) {
					this.pageFixed = true
				}else {
					this.pageFixed = false
				}
			},
			batchPrintSY() {
				var orders = this.rowSelection
				if(orders.length > 0) {
					orders.forEach((function(order) {
						var customerIndex = order.customerIndex || ''
		                var buyerName = order.buyerName || ''
		                var extendIndex = order.extendIndex || ''
		                var city = ''
		                if(extendIndex) {
		                    extendIndex = `(${extendIndex})`
		                }
		                var orderitemList = order.orderitemList
		                orderitemList.forEach((function(el, index) {
                            let productName = el.productName || ''
                            let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                            let suyuanCode = el.suyuanCode || ''
                            let date = this._moment({
                                format: 'YYYY-MM-DD HH:mm:ss'
                            })
                            var html = `
                                <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
                                    商家编号:
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:30px;">${customerIndex}</span>
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:10px;">${extendIndex}</span>
                                </div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">商家:${buyerName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">商品:${productName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:${sortingWeight}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">${date}</div>
                                <div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">${city}</div>
                            `
                            this.Gprinter(html, configs.suyuanURL + suyuanCode)
                        }).bind(this))
					}).bind(this))
				}else {
					this.$message({type: 'info', message: '请选择'});
				}
			},
			modalClose() {
				this.modalParams = {}
				this.modalShow = false
				this.modalType = 'add'
				this.searchTable()
			},
			countSortingWeightNull(orderids, fn) {
				this._ajax({name: 'orderitem/countSortingWeightNull', param: {orderId: orderids}, arr:true})
					.then((function(d) {
						if(d.dataCount > 0) {
							this.$message({type: 'warning',message: d.msg});
						}else {
							fn()
						}
					}).bind(this))
			},
		}
	}
</script>