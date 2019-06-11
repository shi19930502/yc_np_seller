<template>
    <div class="page-sort">
        <div class="toubu_A">
			<span class="tliel_name">
                <searchInputItems>
                    <searchInputItem name="配送时间">
                        <dateEditorDaterange type="date" :showShortcuts="showShortcuts"
                                             :dateValue.sync="distributionTimeBegin"
                                             @change="searchTable"></dateEditorDaterange>
                    </searchInputItem>
                </searchInputItems>
            </span>
        </div>
        <div class="flex-x-start flex-wrap" v-loading="pieLoading">
            <div class="yuanxing_t" id="weightPie" style="height: 400px;width: 100%;"></div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
            <el-tab-pane :label="tabName[0]" :name="tabName[0]">
                <searchInputItems>
                    <searchInputItem name="订单号">
                        <inputItem :value.sync="searchForm.orderUmber"></inputItem>
                    </searchInputItem>
                    <span class="addanniu" style="float: right;">
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchProgressTable()"
                             type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset()">重置</iconBtn>
					</span>
                </searchInputItems>
                <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                           :loading="dataLoading" @sizeChange="handleSizeChangeNow" @currentChange="handleCurrChange"
                           @selectionChange="selectionChange">
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.orderUmber">
                                <span>{{scope.row.orderUmber}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购商">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.buyName">
                                <span>{{scope.row.buyName}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="分拣总数">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.total">
                                <span>{{scope.row.total}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="已分拣">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.sorted">
                                <span>{{scope.row.sorted}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template slot-scope="scope">
                            <span>{{scope.row.total>0 ? (scope.row.sorted*100/scope.row.total).toFixed(2) : 100}}%</span>
                        </template>
                    </el-table-column>
                </elemTable>
            </el-tab-pane>
            <el-tab-pane :label="tabName[1]" :name="tabName[1]">
                <searchInputItems>
                    <searchInputItem name="商品名称">
                        <inputItem :value.sync="searchForm.productName"></inputItem>
                    </searchInputItem>
                    <span class="addanniu" style="float: right;">
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchProgressTable()"
                             type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					</span>
                </searchInputItems>
                <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                           :loading="dataLoading" @sizeChange="handleSizeChangeNow" @currentChange="handleCurrChange"
                           @selectionChange="selectionChange">
                    <el-table-column label="商品名称">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.productName">
                                <span>{{scope.row.productName}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格名称">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.skuName">
                                <span>{{scope.row.skuName}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="分拣总数">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.total">
                                <span>{{scope.row.total}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="已分拣">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.sorted">
                                <span>{{scope.row.sorted}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="需求总量">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.quantity">
                                <span>{{scope.row.quantity}}{{scope.row.baseMeasureName}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="分拣量">
                        <template slot-scope="scope">
                            <toolTip :content="scope.row.sortWeight">
                                <span>{{scope.row.sortWeight}}{{scope.row.baseMeasureName}}</span>
                            </toolTip>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template slot-scope="scope">
                            <span>{{(scope.row.sorted*100/scope.row.total).toFixed(2)}}%</span>
                        </template>
                    </el-table-column>
                </elemTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import local from '../local.js'
    import mixin from '../mixin/mixin.js'

    var weightPie = null
    export default {
        mixins: [mixin],
        data() {
            return {
                distributionTimeBegin: this._getCurrentDate(),
                pieLoading: false,
                dataList: [],
                searchForm: {
                    orderUmber: '',
                    productName: '',
                },
                tabName: ['订单分拣进度', '商品分拣进度'],
                activeName: "订单分拣进度"
            }
        },
        mounted() {
            weightPie = echarts.init(document.getElementById('weightPie'));
            this.searchTable();
        },
        methods: {
            searchTable() {
                this.setWeightPie([], []);
                this.searchPei();
                this.searchProgressTable();
            },
            searchPei() {
                this._ajax({
                    url: this.rootAPI,
                    name: 'orderitem/sortStatusRatio',
                    param: {
                        sellerId: local.get('sessionUser').typeCode,
                        distributionTimeBegin: this.distributionTimeBegin,
                    },
                    loading: 'pieLoading'
                })
                    .then(this.renderPie)
            },
            searchProgressTable() {
                let url = 'orderitem/productSortProgress';
                if (this.activeName === this.tabName[0]) {
                    url = 'orderitem/orderSortProgress';
                }
                this._ajax({
                    url: this.rootAPI,
                    name: url,
                    param: Object.assign({}, {
                        sellerId: local.get('sessionUser').typeCode,
                        distributionTimeBegin: this.distributionTimeBegin,
                        orderUmber: this.searchForm.orderUmber,
                        productName: this.searchForm.productName,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }),
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            handleSizeChangeNow(val) {
                this.pageSize = val
                this.searchProgressTable();
            },
            handleCurrChange(val) {
                this.pageNum = val;
                this.searchProgressTable();
            },
            handleClickTab(tab, event) {
                this.dataList = [];
                this.activeName = tab.name;
                this.reset();
            },
            reset() {
                this.pageNum = 1;
                this.searchForm.orderUmber = '';
                this.searchForm.productName = '';
                this.searchProgressTable()
            },
            renderPie(d) {
                var legendData = [],
                    seriesWeightData = []
                legendData.push("已分拣")
                if (d.aaData.length > 0) {
                    seriesWeightData.push({
                        value: d.aaData[0].sorted,
                        name: "已分拣",
                    })
                    legendData.push("未分拣")
                    seriesWeightData.push({
                        value: d.aaData[0].sorting,
                        name: "未分拣",
                    })
                }
                this.setWeightPie(legendData, seriesWeightData)
            },
            setWeightPie(legenddata, seriesdata) {
                weightPie.setOption(this._setPie({
                    legend: legenddata,
                    seriesData: seriesdata,
                    title: "分拣状态统计"
                }));
            },
        }
    }
</script>