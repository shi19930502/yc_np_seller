<template>
	<div class="page-khNolice">
		<!--<div class="toubu_B">
			<span class="tliel_name">商品列表</span>
			<span class="addanniu">
			</span>
		</div>-->
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="商品名称">
						<inputItem :value.sync="searchForm.productName" placeHolder="请输入商品名"></inputItem>
					</searchInputItem>
					<searchInputItem name="所属库房">
						<selectInput :clearable='true' :value.sync="searchForm.storageId" @selectChange="searchTable">
							<el-option
						      v-for="item in storageList"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</selectInput>
					</searchInputItem>
				</searchInputItems>
				<optionItems>
				</optionItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
                <iconBtn iconClass="el-icon-printer" content="批量打印库存状况明细" @click="batchPrint" type="warning">批量打印明细</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
			</span>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="100" label="序号">
			</el-table-column>
			<el-table-column prop="productCode" label="商品编码">
				<template slot-scope="scope">
					<div>{{scope.row.productCode}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<div>{{scope.row.productName}}</div>
				</template>
			</el-table-column>
				<el-table-column prop="productTypeName" label="所属分类">
				<template slot-scope="scope">
					<div>{{scope.row.productTypeName}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="skuName" label="规格名称">
				<template slot-scope="scope">
					<span>{{scope.row.skuName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="storageId" label="所属库房">
				<template slot-scope="scope">
					<span>{{renderCommon(storageList, scope.row.storageId)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stockQuantityForDecimal" label="基本库存量">
				<template slot-scope="scope">
					<span v-if="scope.row.stockQuantityForDecimal != null">{{scope.row.stockQuantityForDecimal + scope.row.basicUnitName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="avgPriceForDecimal" label="基本均价">
				<template slot-scope="scope">
					<span v-if="scope.row.avgPriceForDecimal != null">{{scope.row.avgPriceForDecimal+'元/'+scope.row.basicUnitName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stockQuantitySkuForDecimal" label="规格库存量">
				<template slot-scope="scope">
					<div v-if="scope.row.stockQuantitySkuForDecimal != null">{{scope.row.stockQuantitySkuForDecimal + scope.row.skuUnitName}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="avgPriceSkuForDecimal" label="规格均价">
				<template slot-scope="scope">
					<div v-if="scope.row.avgPriceSkuForDecimal != null">{{scope.row.avgPriceSkuForDecimal+'元/'+scope.row.skuUnitName}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
                    <div class="el-button-group">
                        <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                        <iconBtn iconClass="el-icon-printer" content="打印库存状况明细" @click="printRow(scope.row)"></iconBtn>
                    </div>
				</template>
			</el-table-column>
		</elemTable>
		<inventorySituationModal :modal='inventorySituationModal' @add='modalAdd' :dataDic="dataDic" v-if='inventorySituationModal' @close='inventorySituationModalClose' :tableRow='tableRow'></inventorySituationModal>
        <div id="printtemp"></div>
	</div>
</template>
<script>
    import local from '../local.js'
    import mixin from '../mixin/mixin.js'
    import inventorySituationModal from './modals/inventorySituationModal.vue'

    export default {
		mixins: [mixin],
		components: {
			inventorySituationModal
		},
		data() {
			return {
				searchForm: {
					productName: ''
				},
				dataDic: {
					productList: []
				},
				dataList: [],
				modalShow: false,
				islookup: false,
				inventorySituationModal: false,
				storageList: [],
			}
		},
		mounted() {
			this.searchTable();
			
			this._ajax({url: this.rootAPI, name: 'storage/list', param: {customerId : local.get('sessionUser').typeCode, enabled : 1}})
             .then((function(d) {
                this.storageList = d.aaData
            }).bind(this))
		},
		methods: {
			renderCommon(dataList, code) {
				if(!code) return '';
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code || obj.id == code) {
						dataShow = obj.name;
						return false;
					}
				});
				return dataShow;
			},
			searchTable() {
				let user = local.get('sessionUser');
				this.typeCode = parseInt((user.typeCode));
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					typeCode: this.typeCode
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'productstock/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
            exportExcel() {
            	let user = local.get('sessionUser');
				this.typeCode = parseInt((user.typeCode));
				Object.assign(this.searchForm, {
					pageNum: "",
					pageSize: "",
					typeCode: this.typeCode
				})
				const _this = this;
				this._ajax({
					url: this.rootAPI,
					name: 'productstock/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then((function (d) {
					var data = d.aaData;
					data.forEach(function (el) {
	                    el['stockQuantityForDecimalTmp'] = el.stockQuantityForDecimal + el.basicUnitName;
	                    el['avgPriceForDecimalTmp'] = el.avgPriceForDecimal + '元/' + el.basicUnitName;
	                    el['stockQuantitySkuForDecimalTmp'] = el.stockQuantitySkuForDecimal + el.skuUnitName;
	                    el['avgPriceSkuForDecimalTmp'] = el.avgPriceSkuForDecimal + '元/' + el.skuUnitName;
	                });
	                var fields = ['productCode', 'productName', 'productTypeName', 'skuName','stockQuantityForDecimalTmp', 'avgPriceForDecimalTmp', 'stockQuantitySkuForDecimalTmp', 'avgPriceSkuForDecimalTmp'],
	                    filedsName = ['商品编码', "商品名称", "所属分类", "规格名称",'基本库存量', '基本均价', "规格库存量", "规格均价"],
	                    fileName = '库存状况';
	                _this._exportExcel(data, fields, filedsName, fileName)
					}))
            },
            batchPrint() {
                if (this.delSelection.length === 0) {
                    this.$message({ type: "info", message: "请选择行" });
                } else {
                    let selection = this.delSelection;
                    this.print(selection);
                }
            },
            printRow(o) {
                var selection = [];
                selection.push(o);
                this.print(selection);
            },
            print(o) {
                const _this = this;
                var printHtml='';
                var len = o.length;
                var count = 0;
                o.forEach((function (el) {
                    const param = {
                        pageNum: 0,
                        pageSize: _this.pageSize,
                        customerId: el.customerId,
                        skuId: el.skuId,
                        productId: el.productId
                    };
                    _this._ajax({url: _this.rootAPI, name: "stockdetail/inventorySituationPrintInfo", param: param})
                        .then((function (d) {
                            count++;
                            var itemHTML='';
                            if (d.state == 0 && d.aaData.detail.aaData && Array.isArray(d.aaData.detail.aaData) && d.aaData.detail.aaData.length > 0) {
                                d.aaData.detail.aaData.forEach((function(em1, index) {
                                    let createdDate = em1.createdDate || '';
                                    let inoutTypeName = em1.inoutTypeName || '';
                                    let productName = em1.productName || '';
                                    let skuName = em1.skuName || '';
                                    let stockQuantitySku = em1.stockQuantitySku/100 + em1.skuUnitName || '';
                                    let stockQuantity = em1.stockQuantity/100 + em1.basicUnitName || '';
                                    let basicUnitName = em1.changeStockForDecimal + em1.basicUnitName|| '';
                                    let priceForDecimal = em1.priceForDecimal+'元/' + em1.basicUnitName || '';
                                    let changeStockSkuForDecimal = em1.changeStockSkuForDecimal|| 0;
                                    changeStockSkuForDecimal = changeStockSkuForDecimal + em1.skuUnitName;
                                    let priceSkuForDecimal = em1.priceSkuForDecimal+'元/' + em1.skuUnitName || '';
//                                  let inout = em1.inoutTypeName || '';
									let inout = em1.inoutType == 1 ? '收入' : '支出';
                                    let changeStockForDecimal = _this._parseFloat(em1.changeStockForDecimal * em1.priceForDecimal, 4) || 0;
                                    var item = this._renderPrintHtml(PRINT_HTML.STOCK_DETAIL, createdDate, inoutTypeName, productName, skuName, stockQuantitySku, stockQuantity, basicUnitName, priceForDecimal, changeStockSkuForDecimal, priceSkuForDecimal, inout, changeStockForDecimal)
                                    itemHTML += item
                                }).bind(this));
                            }
                            const productName = el.productName || '';
                            const productTypeName = el.productTypeName || '';
                            const productCode = el.productCode || '';
                            var pHtml = this._renderPrintHtml(PRINT_HTML.STOCK_MAIN, productCode, productName, productTypeName, itemHTML)
                            if(len > 1) {
                            	this.lodopoPrint('6%','5%','95%','100%',pHtml, d.aaData.detail.aaData.length)
                            }else if(len == 1) {
                            	this.lodopoPreview('6%','5%','95%','100%',pHtml, d.aaData.detail.aaData.length)
                            }                            	       
                        }).bind(this))
                }).bind(this));
            },
			reset() {
				Object.assign(this.searchForm, {
					productName: ''
				})
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			inventorySituationModalClose() {
				this.inventorySituationModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.inventorySituationModal = true;
			}

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