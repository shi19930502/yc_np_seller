<template>
	<div class="orders_received">
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="截止日期">
						<el-date-picker v-model="searchForm.createdDate" type="date" 
						valueFormat="yyyy-MM-dd" placeholder="选择日期" :clearable="false"
						:editable="false"></el-date-picker>
					</searchInputItem>
					<searchInputItem name="采购商名称">
						<inputItem :value.sync="searchForm.buyerName" @enter="searchTable" placeHolder="请输入客户名" ></inputItem>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</span>
		</div>
		<!-- 图表 -->
		<!-- <div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div id="pricePie" style="height: 400px;width: 1650px;"></div>
		</div> -->
		<div class="elem-table" :id="id">
			<el-table :data="dataList" 
			v-loading="dataLoading"
			ref='multipleTable'
		    element-loading-text="数据加载中"
		    element-loading-spinner="el-icon-loading"
		    element-loading-background="rgba(255, 255, 255, 0.8)"
		    :highlight-current-row="highlightCurrentRow"
		    :max-height="maxHeight"
		    :show-summary="showSummary"
		    :summary-method="getSummaries"
		    :border="border">
			    <el-table-column prop="buyerName" label="采购商名称">
					<template slot-scope="scope">
						<toolTip :content="scope.row.buyerName">
							<span>{{scope.row.buyerName}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderCount" label="订单总数量">
					<template slot-scope="scope">
						<toolTip :content="scope.row.orderCount">
							<span>{{scope.row.orderCount}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="unpayOrderCount" label="未支付订单数量">
					<template slot-scope="scope">
						<toolTip :content="scope.row.unpayOrderCount">
							<span>{{scope.row.unpayOrderCount}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="termYqTotal" label="逾期订单数量">
					<template slot-scope="scope">
						<toolTip :content="scope.row.termYqTotal">
							<span>{{scope.row.termYqTotal}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderTotal" label="订单总金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.orderTotal/100+'元'">
							<span>{{scope.row.orderTotal/100 +'元'}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="payedTotal" label="已支付金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.payedTotal/100+'元'">
							<span>{{scope.row.payedTotal/100+'元'}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="unpayTotal" label="未支付金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.unpayTotal/100+'元'">
							<span>{{scope.row.unpayTotal/100+'元'}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="termTotal" label="逾期金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.termTotal/100+'元'">
							<span>{{scope.row.termTotal/100+'元'}}</span>
						</toolTip>
					</template>
				</el-table-column>
				
				<el-table-column label="操作" fixed="right" width="250" >
					<template slot-scope="scope">
						<elBtn @click="lookOver(scope.row)" v-if="!scope.row.isCount">查看明细</elBtn>
					</template>
				</el-table-column>
			</el-table>
			<div class="flex-x-end" v-if="showPagination">
		      <el-pagination
		        @size-change="handleSizeChange"
		        @current-change="handleCurrentChange"
		        :current-page="currentPage"
		        :page-sizes="pageSizes"
		        :page-size="pageSize"
		        layout="total, sizes, prev, pager, next, jumper"
		        :total="pageTotal">
		      </el-pagination>
			</div>
		</div>
		<customerStatisticsModal ref='orderStatistics'  :tableRow='tableRow'></customerStatisticsModal>
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import customerStatisticsModal from './modals/customerStatisticsModal.vue'
	var pricePie = null;
	export default {
		mixins: [mixin],
		components: {
			customerStatisticsModal
		},
		data() {
			return {
				dataList: [],
				pieLoading: false,
				dateValue: [],
				countData:{},
				everOrderSum: {},
				channelList: [],
                buyerList:[],
                searchForm: {
						createdDate:this.getToday
				},
				sellerId: '',
				orderStatisticsModal: false,
				tableRow: {},
				loading: false,
				highlightCurrentRow: false,
				showPagination: true,
				maxHeight: 99999999,
				id: null,
				border: true,
				showSummary: true,
				tableSummary: []
			}
		},
		mounted() {
			this.searchForm.createdDate = this.getToday;
			this.searchTable();
		},
		methods: {
			getSummaries({ columns, data }) {
				return this.tableSummary
			},
			async searchTable() {			
				let user = local.get('sessionUser');
				this.sellerId = user.typeCode;
				var Teparam = Object.assign({}, this.searchForm, {
					orderField:'f_seller_id',
					sellerId: this.sellerId
				})
				var res = await this._ajax({
										url: this.rootAPI + 'customertermmapping/queryConutTable',
										param: Teparam
									})
				var resData = res.aaData[0]
				this.tableSummary = [
					'统计', resData.orderCount, 
					resData.unpayOrderCount,
					resData.termYqTotal, 
					resData.orderTotal / 100+"元", 
					resData.payedTotal / 100+"元", 
					resData.unpayTotal / 100+"元", 
					resData.termTotal / 100+"元"
				]
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					orderField:'f_buyer_id',
					sellerId: this.sellerId
				})
				return this._ajax({
						url: this.rootAPI,
						name: 'customertermmapping/queryConutTable',
						param: param
				}).then(this.renderTable)
			},
			reset(){
                this.searchForm = {
					createdDate:this.getToday
				};
				this.searchTable();
			},
			exportExcel() {
				var arr = [["采购商名称",
								"订单总数量",
								"支付订单数量",
								"逾期订单数量",
								"订单总金额",
								"已支付金额",
								"未支付金额",
								"逾期金额"]]
				var fields = ['buyerName',
							'orderCount',
							'unpayOrderCount',
							'termYqTotal',
							'orderTotal',
							'payedTotal',
							'unpayTotal',
							'termTotal'],
					filedsName = ["采购商名称",
								"订单总数量",
								"支付订单数量",
								"逾期订单数量",
								"订单总金额",
								"已支付金额",
								"未支付金额",
								"逾期金额"],
					fileName = '账期统计表';
					
				let user = local.get('sessionUser');
				this.sellerId = user.typeCode;
				var param = Object.assign({}, this.searchForm, {
					orderField:'f_buyer_id',
					sellerId: this.sellerId
				})
				this._ajax({
					url: this.rootAPI + 'customertermmapping/queryConutTable',
					param: param,
					arr: true
				}).then((data)=>{
					data.aaData = data.aaData.map((function(el) {
						return Object.assign(el, {
							orderTotal: el.orderTotal/100,
							payedTotal: el.payedTotal/100,
							unpayTotal: el.unpayTotal/100,
							termTotal: el.termTotal/100
						})
					}).bind(this))
					data.aaData.forEach(function(row) {
						var o = [row.buyerName + "", row.orderCount + "", row.unpayOrderCount + "", row.termYqTotal + "", row.orderTotal + "", 
                    			row.payedTotal + "", row.unpayTotal + "", row.termTotal + ""]
                    	arr.push(o);
					})
					this._excel(arr, '账期统计表.xlsx')
				})
			},
			renderWeightPie(d) {
				var legendData = ['订单金额', '订单数额'],
					seriesCount = [],
					seriesPrice = [],
					xAxisData = [],
					seriesPriceData = [],
					yAxis = []
				d.aaData.forEach(function(el) {
					//进场数据
					seriesCount.push(el.orderCount)
					//销售数据
					seriesPrice.push(el.orderTotal)
					xAxisData.push(el.orderDate)
				})
				seriesPriceData = [{
					name: '订单金额',
					data: seriesPrice,
				}, {
					name: '订单数额',
					data: seriesCount,
					yAxisIndex: 1
				}]
				if(seriesCount.length >= seriesPrice.length) {
					yAxis = [{
							name: '订单金额',
							type: 'value',
						},
						{
							name: '订单数额',
							type: 'value',
							splitLine: false
						}
					]
				} else {
					yAxis = [{
							name: '订单金额',
							type: 'value',
							splitLine: false
						},
						{
							name: '订单数额',
							type: 'value',
						}
					]
				}
				// 图表设置
				this.setPricePie(legendData, seriesPriceData, xAxisData, yAxis)
				// 封装导出数据
				this.csvDataList = d.aaData

			},
			setPricePie(legenddata, seriesdata, xAxisData, yAxis) {
				pricePie.setOption(this._setBar({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: seriesdata,
					chartLegend: {
						type: 'scroll',
						orient: 'horizontal',
						right: '50%',
						top: 20,
						bottom: 20,
					},
					yAxis
				}));
			},
			/*orderStatisticsModalClose() {
				this.orderStatisticsModal = false;
			},*/
			showOrderStatisticsWin() {

			},
			lookOver(row) {
				this.tableRow = row;
				this.tableRow.createdDate = this.searchForm.createdDate;
				//this.orderStatisticsModal = true;
                this.$refs.orderStatistics.xs_orderglModal = false;
				this.$refs.orderStatistics.show(this.tableRow);
			}
		},
		beforeDestroy() {
			this.$emit('update:loading', false)
		}
	}
</script>
<style lang="sass">
	.orders_received {
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