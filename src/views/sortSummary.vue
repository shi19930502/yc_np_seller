<template>
    <div class="page-sort">
        <div class="toubu_A">
			<span class="tliel_name">
                <searchInputItems>
                    <searchInputItem name="配送时间">
                        <dateEditorDaterange type="date" :showShortcuts="showShortcuts"
                                             :dateValue.sync="searchForm.distributDate"
                                             @change="searchTable"></dateEditorDaterange>
                    </searchInputItem>
                    <searchInputItem name="商品/规格名称">
                        <inputItem :value.sync="searchForm.proNameOrSkuName" placeHolder="请输入商品/规格名称"></inputItem>
                    </searchInputItem>
                    <searchInputItem name="分拣状态">
                        <selectInput :clearable='true' :value.sync="searchForm.sortState" @selectChange="searchTable">
                            <el-option key="1" label="全部" value="1"></el-option>
                            <el-option key="2" label="未分拣" value="2"></el-option>
                            <el-option key="3" label="分拣中" value="3"></el-option>
                            <el-option key="4" label="已分拣" value="4"></el-option>
                        </selectInput>
                    </searchInputItem>
                </searchInputItems>
             </span>
            <span class="addanniu">
                <elBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</elBtn>
                <elBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</elBtn>
                <elBtn iconClass="el-icon-refresh" content="批量打印" @click="batchPrint">批量打印</elBtn>
                <iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
        </div>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChangeNow" @currentChange="handleCurrChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <!--配送日期，商品名称，规格名称，分拣任务数，已分拣任务数，未分拣任务数-->
            <el-table-column label="配送日期">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.distributDate">
                        <span>{{scope.row.distributDate}}</span>
                    </toolTip>
                </template>
            </el-table-column>
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
            <el-table-column label="未分拣">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.total-scope.row.sorted">
                        <span>{{scope.row.total-scope.row.sorted}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!--<iconBtn content="确认受理" v-if="scope.row.status!=1" @click="updateStatusToOne(scope.row)" type="primary" plain>确认受理</iconBtn>
                    <iconBtn content="拒绝" v-if="scope.row.status!=1" @click="invoke(scope.row)" type="info" plain>拒绝</iconBtn>-->
                    <!--<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>-->
                    <iconBtn iconClass="el-icon-printer" content="打印分拣小票" @click="printRow(scope.row)"></iconBtn>
                </template>
            </el-table-column>
        </elemTable>
    </div>
</template>
<script>
    import local from '../local.js'
    import mixin from '../mixin/mixin.js'
    import configs from '../configs.js'

    export default {
        mixins: [mixin],
        components: {},
        data() {
            return {
                pieLoading: false,
                dataList: [],
                searchForm: {
                    sortState: '',
                    proNameOrSkuName: '',
                    distributDate: this._getDate(),
                },
                tabName: ['订单分拣进度', '商品分拣进度'],
                activeName: "订单分拣进度",
                pageNum: 1,
                pageSize: 10,
                showModal: false,
                sellerId: local.get('sessionUser').typeCode,
                exportDataList: []
            }
        },
        mounted() {
            this.searchTable();
        },
        methods: {
            lookOver(o) {
                this.tableRow = o;
                this.showModal = true;
            },
            ModalClose() {
                this.showModal = false;
            },
            searchTable() {
                this._ajax({
                    url: this.rootAPI,
                    name: 'orderitem/orderSortSummary',
                    param: Object.assign({}, {
                        sellerId: this.sellerId,
                        distributDate: this.searchForm.distributDate,
                        sortState: this.searchForm.sortState,
                        proNameOrSkuName: this.searchForm.proNameOrSkuName,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }),
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            handleSizeChangeNow(val) {

            },
            handleSizeChangeNow(val) {
                this.pageSize = val
                this.searchTable();
            },
            handleCurrChange(val) {
                this.pageNum = val;
                this.searchTable();
            },
            reset() {
                this.pageNum = 1;
                this.pageSize = 10;
                this.searchForm.sortState = '';
                this.searchForm.proNameOrSkuName = '';
                this.searchForm.distributDate = '';
                searchTable();
            },
            exportExcel() {
                this.exportDataList = [],
                    this._ajax({
                        url: this.rootAPI,
                        name: 'orderitem/orderSortSummary',
                        param: Object.assign({}, {
                            sellerId: this.sellerId,
                            distributDate: this.searchForm.distributDate,
                            sortState: this.searchForm.sortState,
                            proNameOrSkuName: this.searchForm.proNameOrSkuName,
                            pageNum: 1,
                            pageSize: 0,
                        }),
                        loading: 'dataLoading'
                    }).then((function (d) {
                        let data = d.aaData;
                        this.exportDataList = data;
                        var fields = ['distributDate', 'productName', 'skuId', 'skuName', 'sorted', 'total'],
                            filedsName = ['配送时间', '商品名称', '规格id', '规格名称', '已分拣数', '分拣总数'],
                            fileName = '商品分拣单' + this._getDate();
                        this._exportExcel(this.exportDataList, fields, filedsName, fileName)
                    }).bind(this));
            },
            batchPrint() {
                if (this.delSelection.length === 0) {
                    this.$message({type: "info", message: "请选择行"});
                } else {
                    let selection = this.delSelection;
                    this.print(selection);
                }
            },
            printRow(o) {//打印一行
                var selection = [];
                selection.push(o);
                this.print(selection);
            },
            print(o) {
                const _this = this;
                if (o.length < 1) {
                    return;
                }
                this.back2Top();
                //选择打印机
                this.SelectAsDefaultPrinter((function () {
                    o.forEach((function (el) {
                        const param = {
                            sellerId: this.sellerId,
                            distributDate: el.distributDate,
                            skuId: el.skuId,
                        };
                        _this._ajax({url: _this.rootAPI, name: "orderitem/orderSortSummaryDetail", param: param})
                            .then((function (d) {
                                console.log(d);
                                if (d.aaData.length < 1) {
                                    return;
                                }
                                d.aaData.forEach((function (em1) {
                                    let distributDate = em1.distributDate;
                                    let productName = em1.productName;
                                    let skuName = em1.skuName;
                                    let baseMeasureName = em1.baseMeasureName;
                                    let sortWeight = em1.sortWeight;
                                    let suyuanCode = em1.suyuanCode;
                                    let date = this._moment({
                                        format: 'YYYY-MM-DD HH:mm:ss'
                                    });
                                    var html = `
                                <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
                                    配送时间:${distributDate}
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:30px;"></span>
                                    <span style="font-weight: bolder;font-size: 15px;padding-left:10px;"></span>
                                </div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">商品名称:${productName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">规格名称:${skuName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣单位:${baseMeasureName}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:${sortWeight}</div>
                                <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">${date}</div>
                            `
                                    this.Gprinter(html, configs.suyuanURL + suyuanCode);
                                }).bind(this))
                            }).bind(this))
                    }).bind(this));
                }).bind(this));
            },
        }
    }
</script>

<style type="text/scss" lang="sass">
    .addanniu {
        float: right;
    }
</style>