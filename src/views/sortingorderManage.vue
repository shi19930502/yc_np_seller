<template>
    <div class="page-sort">
        <div class="toubu_B">
			<span class="tliel_name">
                <searchInputItems>
                    <searchInputItem name="订单号">
                        <inputItem :value.sync="searchForm.orderUmber"></inputItem>
                    </searchInputItem>
                    <searchInputItem name="采购商">
                        <inputItem :value.sync="searchForm.buyerName"></inputItem>
                    </searchInputItem>
                    <searchInputItem name="订单时间">
                        <dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
                    </searchInputItem>
                </searchInputItems>
			</span>
            <span class="addanniu">
                <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                <iconBtn iconClass="el-icon-printer" content="批量打印销货单" @click="batchPrint" type="warning">批量打印销货单
                </iconBtn>
                <iconBtn iconClass="el-icon-printer" content="批量打印小票" @click="batchPrintSuyuan">批量打印小票</iconBtn>
                <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                <iconBtn iconClass="el-icon-sort" content="同步订单" @click="syncOrder">同步订单</iconBtn>
			</span>
        </div>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="orderUmber" label="订单编号">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.orderUmber">
                        <div>{{scope.row.orderUmber}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="buyerName" label="采购商">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.buyerName">
                        <div>{{scope.row.buyerName}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="orderTotal" label="需求总金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.orderTotal/100">
                        <div>{{scope.row.orderTotal/100}}&nbsp;</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="sortingOrderTotal" label="分拣总金额(元)">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.sortingOrderTotal/100 || '--'">
                        <div>{{scope.row.sortingOrderTotal/100||'--'}}&nbsp;</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="sortingStatus" label="分拣状态">
                <template slot-scope="scope">
                    <toolTip :content="_dicValue(scope.row.sortingStatus, statuslist)">
                        <span>{{_dicValue(scope.row.sortingStatus, statuslist)}}</span>
                    </toolTip>
                    <!-- <toolTip :content="scope.row.sortingStatus">
                        <div v-if="scope.row.sortingStatus==0">未分拣</div>
                        <div v-if="scope.row.sortingStatus==1">已锁定</div>
                        <div v-if="scope.row.sortingStatus==2">已分拣</div>
                        <div v-else>无效分拣</div>
                    </toolTip> -->
                </template>
            </el-table-column>
            <el-table-column prop="orderDate" label="订单时间">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.orderDate">
                        <div>{{scope.row.orderDate}}</div>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                    <iconBtn iconClass="el-icon-printer" content="打印销货单" @click="printFun(scope.row)"
                             v-if="scope.row.sortingStatus == 2"></iconBtn>
                    <!--<el-button type="success" @click="lookOver(scope.row)"  >编辑</el-button>-->
                </template>
            </el-table-column>
        </elemTable>
        <sortingtaskModal :modal='showModal' v-if='showModal' @close='ModalClose' :tableRow='tableRow'
                          @submit="modalSubmit"></sortingtaskModal>
        <div id="printtemp"></div>
    </div>
</template>
<script>
    import local from "../local.js";
    import mixin from "../mixin/mixin.js";
    import sortingtaskModal from "./modals/sortingtaskModal.vue";
    import configs from '../configs.js'
    import mixin_ticket from "../mixin/mixin_ticket";

    export default {
        mixins: [mixin, mixin_ticket],
        components: {sortingtaskModal},
        data() {
            return {
                dataList: [],
                searchForm: {
                    orderUmber: "",
                    buyerName: "",
                    startTime: "",
                    endTime: ""
                },
                statuslist: [
                    {key: '0', value: "未分拣"},
                    {key: '1', value: "已锁定"},
                    {key: '2', value: "已分拣"},
                    {key: '3', value: "无效分拣"}
                ],
                dateRange: [],
                showModal: false,
                lodop: ""
            };
        },
        mounted() {
            this.searchTable();
        },
        methods: {
            searchTable() {
                let user = local.get('sessionUser');
                /**customerid  需要从缓存中获取 */
                this.searchForm.sellerId = parseInt(user.typeCode);
                if (this.dateRange && this.dateRange.length > 0) {
                    this.searchForm.startTime = this.dateRange[0];
                    this.searchForm.endTime = this.dateRange[1];
                }else {
                	 this.searchForm.startTime = "";
                	 this.searchForm.endTime = "";
                }
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                });
                return this._ajax({
                    url: this.rootAPI,
                    name: "sorSortingorder/list",
                    param: this.searchForm,
                    loading: "dataLoading"
                }).then(this.renderTable);
            },
            batchPrint() {
                if (this.rowSelection.length === 0) {
                    this.$message({type: "info", message: "请选择行"});
                } else {
                    this.rowSelection.forEach((function (el) {
                        var sellerName = el.sellerName || ''
                        this._ajax({
                            name: "sorSortingorder/GetStockBillInfo",
                            param: {
                                orderIds: el.orderId
                            },
                        })
                            .then((function (d) {
                                if (d.state == 0 && d.aaData && Array.isArray(d.aaData.detaillist) && Array.isArray(d.aaData.headlist) && d.aaData.detaillist.length > 0 && d.aaData.headlist.length > 0) {
                                    var detaillist = d.aaData.detaillist
                                    var headlist = d.aaData.headlist[0]
                                    var orderNumber = headlist.orderNumber || ''
                                    var buyerName = headlist.buyerName || ''
                                    var deliveryDate = ''
                                    if (headlist.deliveryDate) {
                                        if (headlist.deliveryDate.split("~").length > 0) {
                                            var startTime = headlist.deliveryDate.split("~")[0]
                                            var endTime = headlist.deliveryDate.split("~")[1]
                                            if (endTime.split(' ').length > 0) {
                                                endTime = endTime.split(' ')[1]
                                            }
                                            deliveryDate = startTime + '-' + endTime
                                        } else {
                                            deliveryDate = headlist.deliveryDate || ''
                                        }
                                    }
                                    var address = headlist.address || ''
                                    var contacts = headlist.contacts || ''
                                    var phoneNumber = headlist.phoneNumber || ''
                                    var customerIndex = headlist.customerIndex || ''
                                    var sellerTel = headlist.sellerTel || ''
                                    var marketTitle = this.$store.state.marketTitle || ''
                                    var printHtml = ''
                                    var trs = ''
                                    detaillist.forEach((function (em, index) {
                                        let _index = index + 1
                                        let skuName = em.skuName
                                        let productName = em.productName || ''
                                        let sorterJobno = em.sorterJobno || ''
                                        let priceForDecimal = em.priceForDecimal
                                        let weight = em.weight
                                        let sortingTotalForDecimal = em.sortingTotalForDecimal
                                        let sortingWeightTemp = em.sortingWeight
                                        if (!sortingWeightTemp) sortingWeightTemp = 0
                                        let sortingWeight = sortingWeightTemp + em.measuerName
                                        let comment = em.comment
                                        let itemHTML = this._renderPrintHtml(PRINT_HTML.ORDER_ITEM, _index, productName, skuName, priceForDecimal, weight, sortingWeight, sortingTotalForDecimal, comment)
                                        trs = trs + itemHTML
                                    }).bind(this))
                                    var address = headlist.address || ''
                                    var contacts = headlist.contacts || ''
                                    var phoneNumber = headlist.phoneNumber || ''
                                    var sellerTel = headlist.sellerTel || ''
                                    var customerIndex = headlist.customerIndex || ''
                                    var orderTotalForDecimal = headlist.orderTotalForDecimal
                                    var sortingOrderTotalForDecimal = headlist.sortingOrderTotalForDecimal
                                    var marketTitle = this.$store.state.marketTitle || ''
                                    var titleName = '销货单'
                                    var footer1 = '分拣员'
                                    var footer2 = '配送员'
                                    var footer3 = '验收人'
                                    printHtml = this._renderPrintHtml(PRINT_HTML.ORDER_MAIN,
                                        marketTitle + titleName,
                                        sellerTel,
                                        orderNumber,
                                        buyerName,
                                        customerIndex,
                                        contacts,
                                        phoneNumber,
                                        address,
                                        deliveryDate,
                                        trs,
                                        orderTotalForDecimal,
                                        orderTotalForDecimal,
                                        sortingOrderTotalForDecimal,
                                        sortingOrderTotalForDecimal,
                                        footer1,
                                        footer2,
                                        footer3)
                                    this.lodopoPrint('6%', '5%', '95%', '100%', printHtml, detaillist.length)
                                }
                            }).bind(this))
                    }).bind(this))
                }
            },
            printFun(row) {
                var sellerName = row.sellerName || ''
                this._ajax({
                    name: "sorSortingorder/GetStockBillInfo",
                    param: {
                        orderIds: row.orderId
                    },
                }).then(d => {
                    if (d.state == 0 && d.aaData && Array.isArray(d.aaData.detaillist) && Array.isArray(d.aaData.headlist) && d.aaData.detaillist.length > 0 && d.aaData.headlist.length > 0) {
                        var trs = ''
                        var printHtml = ''
                        var detaillist = d.aaData.detaillist
                        console.log(detaillist)
                        detaillist.forEach((function (el, index) {
                            let _index = index + 1
                            let skuName = el.skuName
                            let productName = el.productName
                            let sorterJobno = el.sorterJobno
                            let priceForDecimal = el.priceForDecimal
                            let weight = el.weight
                            let sortingTotalForDecimal = el.sortingTotalForDecimal
                            let sortingWeightTemp = el.sortingWeight
                            if (!sortingWeightTemp) sortingWeightTemp = 0
                            let sortingWeight = sortingWeightTemp + el.measuerName
                            let comment = el.comment
                            let itemHTML = this._renderPrintHtml(PRINT_HTML.ORDER_ITEM, _index, productName, skuName, priceForDecimal, weight, sortingWeight, sortingTotalForDecimal, comment)
                            trs = trs + itemHTML
                        }).bind(this))
                        var headlist = d.aaData.headlist[0]
                        var orderNumber = headlist.orderNumber || ''
                        var buyerName = headlist.buyerName || ''
                        var deliveryDate = ''
                        if (headlist.deliveryDate) {
                            if (headlist.deliveryDate.split("~").length > 0) {
                                var startTime = headlist.deliveryDate.split("~")[0]
                                var endTime = headlist.deliveryDate.split("~")[1]
                                if (endTime.split(' ').length > 0) {
                                    endTime = endTime.split(' ')[1]
                                }
                                deliveryDate = startTime + '-' + endTime
                            } else {
                                deliveryDate = headlist.deliveryDate || ''
                            }
                        }
                        var address = headlist.address || ''
                        var contacts = headlist.contacts || ''
                        var phoneNumber = headlist.phoneNumber || ''
                        var sellerTel = headlist.sellerTel || ''
                        var customerIndex = headlist.customerIndex || ''
                        var orderTotalForDecimal = headlist.orderTotalForDecimal
                        var sortingOrderTotalForDecimal = headlist.sortingOrderTotalForDecimal
                        var marketTitle = this.$store.state.marketTitle || ''
                        var titleName = '销货单'
                        var footer1 = '分拣员'
                        var footer2 = '配送员'
                        var footer3 = '验收人'
                        printHtml = this._renderPrintHtml(PRINT_HTML.ORDER_MAIN,
                            marketTitle + titleName,
                            sellerTel,
                            orderNumber,
                            buyerName,
                            customerIndex,
                            contacts,
                            phoneNumber,
                            address,
                            deliveryDate,
                            trs,
                            orderTotalForDecimal,
                            orderTotalForDecimal,
                            sortingOrderTotalForDecimal,
                            sortingOrderTotalForDecimal,
                            footer1,
                            footer2,
                            footer3)
                        this.lodopoPreview('6%', '5%', '95%', '100%', printHtml, detaillist.length)
                    } else {
                        this.$message({
                            type: "failure",
                            message: d.msg
                        });
                    }
                });
            },
            reset() {
                Object.assign(this.searchForm, {
                    orderUmber: "",
                    buyerName: "",
                    startTime: "",
                    endTime: ""
                });
                this.dateRange = [];
                this.handleCurrentChange(1)
            },
            lookOver(o) {
                this.tableRow = o;
                this.showModal = true;
            },
            ModalClose() {
                this.showModal = false;
            },
            syncOrder() {
                let user = local.get('sessionUser');
                this._ajax({
                    url: this.rootAPI,
                    name: "sortingClient/GetSortingOrder",
                    param: {customerId: parseInt(user.typeCode || 0)},
                    loading: "dataLoading"
                }).then(d => {
                    if (d.state == 0) {
                        this.$message({
                            type: "success",
                            message: d.msg
                        });
                        this.searchTable();
                    } else {
                        this.$message({
                            type: "failure",
                            message: d.msg
                        });
                    }

                });
            },
            batchPrintSuyuan() {
                if (this.rowSelection.length > 0) {
                    this.back2Top()

                    var printEntity = [];
                    var rowIndex = 0;
                    this.rowSelection.forEach((function (row) {
                        rowIndex++;
                        var customerIndex = row.customerIndex || ''
                        var buyerName = row.buyerName || ''
                        var extendIndex = row.extendIndex || ''
                        var city = ''

                        var pa = {
                            orderId: row.orderId
                        };
                        this._ajax({
                            url: this.tootAPI,
                            name: "sorSortingtask/Getsortingtaskdetail",
                            param: pa
                        })
                            .then((function (d) {
                                d.aaData.forEach((function (el, index) {
                                    let productName = el.productName || ''
                                    let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measuerName : el.weight + el.measuerName;
                                    let suyuanCode = el.suyuanCode || ''
                                    let date = this._moment({
                                        format: 'YYYY-MM-DD HH:mm:ss'
                                    })
                                    let o = {
                                        customerIndex: customerIndex,
                                        extendIndex: extendIndex,
                                        buyerName: buyerName,
                                        productName: productName,
                                        sortingWeight: sortingWeight,
                                        date: date,
                                        city: city
                                    }

                                    let ent = {};
                                    ent.html = this.generateSuyuanHtml(o);
                                    ent.suyuanCode = suyuanCode;
                                    printEntity.push(ent);
                                }).bind(this))
                                if (rowIndex === this.rowSelection.length) {
                                    let _this = this;
                                    this.SelectAsDefaultPrinter((function () {
                                        printEntity.forEach(function (ent) {
                                            _this.Gprinter(ent.html, configs.suyuanURL + ent.suyuanCode)
                                        })
                                    }).bind(this))
                                }
                            }).bind(this))
                    }).bind(this))
                } else {
                    this.$message({type: 'info', message: '请选择行'});
                }
            },
        }
    };
</script>
<style lang="sass">
    .page-sort {
        .toubu_B {
            height: 120px;
            padding: 10px;
            .tliel_name {
                float: left
    }
        .addanniu {
            float:right;
    } } }
</style>