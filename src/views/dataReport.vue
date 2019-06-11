<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
            <el-tab-pane :label="tabName[0]" :name="tabName[0]">
                <searchInputItems>
                    <searchInputItem name="采购商">
                        <inputItem :value.sync="searchForm.buyerName" @enter="searchTable"></inputItem>
                    </searchInputItem>
                    <searchInputItem name="订单号">
                        <inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
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
                    <span class="addanniu" style="float: right;">
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable()"
                             type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset()">重置</iconBtn>
					</span>
                </searchInputItems>

                <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                           :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                           @selectionChange="selectionChange">
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderUmber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购商">
                        <template slot-scope="scope">
                            <span>{{scope.row.buyerName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderStatusName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="物流状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.shippingStatusName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.payStatusName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.payWayStatusName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上传状态">
                        <template slot-scope="scope">
                            <span>{{null==scope.row.uploadStatus ? uploadStatusList[0]:uploadStatusList[scope.row.uploadStatus]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上传时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.uploadDate}}</span>
                        </template>
                    </el-table-column>
                </elemTable>
            </el-tab-pane>
            <el-tab-pane :label="tabName[1]" :name="tabName[1]">
                <searchInputItems>
                    <searchInputItem name='商品名称'>
                        <inputItem :value.sync="searchForm.productName" @enter="searchTable"
                                   placeHolder="请输入商品名称"></inputItem>
                    </searchInputItem>
                    <searchInputItem name='批次号'>
                        <inputItem :value.sync="searchForm.batchId" @enter="searchTable"
                                   placeHolder="请输入批次号"></inputItem>
                    </searchInputItem>
                    <searchInputItem name="进场时间区间">
                        <dateEditorDaterange :dateValue.sync='inDate'>
                        </dateeditordaterange>
                    </searchInputItem>
                    <span class="addanniu" style="float: right;">
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable"
                             type="primary">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					</span>
                </searchInputItems>
                <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                           :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                           @selectionChange="selectionChange">
                    <el-table-column label="进场时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.inDate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.productName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.skuName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="进场单价(元)">
                        <template slot-scope="scope">
                            <span>{{scope.row.price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="进场量(千克)">
                        <template slot-scope="scope">
                            <span>{{scope.row.weight}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="批次号">
                        <template slot-scope="scope">
                            <span>{{scope.row.batchId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道">
                        <template slot-scope="scope">
                            <span>{{scope.row.channelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属市场名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.wholesaleMarketName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商">
                        <template slot-scope="scope">
                            <span>{{scope.row.wsSupplierName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="进场状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.statusName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上传状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.sourceId>0 ? uploadStatusList[1]:uploadStatusList[0]}}</span>
                        </template>
                    </el-table-column>
                </elemTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import mixin from '../mixin/mixin.js'
    import local from '../local.js'

    export default {
        mixins: [mixin],
        data() {
            return {
                dataList: [],
                searchForm: {
                    buyerName: '',
                    orderUmber: '',
                    payType: '',
                    productName: '',
                    batchId: '',
                    startTime: '',
                    endTime: '',
                },
                inDate: [],
                payTypeList: [],
                uploadStatusList: ['未上传', '上传成功', '上传失败', '终止上传'],
                uploadStatusIconList: ['el-icon-upload2', 'el-icon-success', 'el-icon-error', 'el-icon-warning'],
                tabName: ['交易数据', '进场数据'],
                activeName: "交易数据"
            }
        },
        mounted() {
            this._searchDic('PAY_WAY')
                .then((function (d) {
                    this.payTypeList = this._dicKey(d)
                }).bind(this))
            this.searchTable();
        },
        methods: {
            searchTable() {
                let url = 'inmarketdetail/list';
                if (this.activeName === this.tabName[0]) {
                    url = 'order/queryUploadStatusList';
                    Object.assign(this.searchForm, {
                        sellerId: local.get('sessionUser').typeCode,
                    });
                } else {
                    this.searchForm.startTime = this.inDate[0];
                    this.searchForm.endTime = this.inDate[1];
                }
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                })
                return this._ajax({name: url, param: this.searchForm, loading: 'dataLoading'})
                    .then(this.renderTable)
            },
            handleClickTab(tab, event) {
                this.dataList = [];
                this.activeName = tab.name;
                this.reset();
            },
            reset() {
                this.pageNum = 1;
                this.searchForm.orderUmber = '';
                this.searchForm.buyerName = '';
                this.searchForm.payType = '';
                this.searchForm.productName = '';
                this.searchForm.batchId = '';
                this.searchForm.startTime = '';
                this.searchForm.endTime = '';
                this.inDate = [];
                this.searchTable()
            },
        }
    }
</script>