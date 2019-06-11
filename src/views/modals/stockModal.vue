<template>
    <div class="stock-modal">
       <el-dialog custom-class="jz-modal" :title="stockModalType === 'add' ? '新增' + stockTypeName + '记录' : stockModalType === 'edit' ? '编辑' + stockTypeName + '记录' : '查看明细'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item :label="stockTypeName + '类型' " :prop="stockModalType !== 'check' ? 'stockChangeType' : ''">
                            <selectInput :clearable='true' :value.sync="form.stockChangeType" v-if="stockModalType === 'add' || stockModalType === 'edit'">
                                <el-option
                                  v-for="item in stockChangeTypeList"
                                  :key="item.key"
                                  :label="item.value"
                                  :value="item.key">
                                </el-option>
                            </selectInput>
                            <inputItem :value.sync="form.inoutTypeName" :disabled="true" v-else></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="供应商" :prop="stockModalType !== 'check' ? 'supplierId' : ''" v-if="stockType === 'in'">
                            <!--<inputItem :value.sync="form.supplierName" :append="true" :readonly="true" v-if="stockModalType === 'add' || stockModalType === 'edit'">
                                <elBtn iconClass="el-icon-search" slot="append" @click="selectSupplier"></elBtn>
                            </inputItem>
                            <inputItem :value.sync="form.supplierName" :disabled="true" v-else></inputItem>-->
                            <selectInput :clearable='true' :value.sync="form.supplierId" v-if="stockModalType === 'add' || stockModalType === 'edit'">
                                <el-option
                                  v-for="item in supplierList"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                            </selectInput>
                            <inputItem :value.sync="form.supplierName" :disabled="true" v-else></inputItem>
                        </el-form-item>
                        <el-form-item label="来源单号" v-if="stockType === 'out'">
                            <inputItem :value.sync="form.sourceId" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="名称" :prop="stockModalType !== 'check' ? 'stockTitle' : ''">
                            <inputItem :value.sync="form.stockTitle" :disabled="stockModalType !== 'add' && stockModalType !== 'edit'"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"> 
                    	<el-form-item :label="stockTypeName + '库房'" :prop="stockModalType !== 'check' ? 'storageId' : ''">
                            <selectInput :clearable='true' :value.sync="form.storageId" @selectChange="storageChange" v-if="stockModalType === 'add' || stockModalType === 'edit'">
                                <el-option
                                  v-for="item in storageList"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>                                
                            </selectInput>
                            <inputItem :value.sync="storageName" :disabled="true" v-else></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="合计金额(元)" v-if="stockModalType === 'check' || stockModalType === 'edit'">
                            <inputItem :value.sync="form.totalAmountForDecimal" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="备注" prop="comment" class="row-block">
                            <inputItem :value.sync="form.comment" type="textarea" :disabled="stockModalType !== 'add' && stockModalType !== 'edit'"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>                         
            </el-form> 
            <el-tabs v-model="tabModal">
                <el-tab-pane :label="stockTypeName + '明细'" name="first">
                    <searchInputItems v-if="stockModalType === 'add' || stockModalType === 'edit'">
                        <searchInputItem name="选择商品">
                            <inputItem :append="true" :readonly="true" placeHolder="请选择商品">
                                <elBtn iconClass="el-icon-search" slot="append" @click="selectProduct"></elBtn>
                            </inputItem>
                        </searchInputItem>
                    </searchInputItems>
                    <!-- <searchInputItems v-if="stockModalType === 'add' || stockModalType === 'edit'" class="row-block">
                        <searchInputItem name="备注">
                            <inputItem :value.sync="detailForm.comment" @blur="changeComment(detailForm.comment)" type="textarea"></inputItem>
                        </searchInputItem>                        
                    </searchInputItems> -->
                    <!-- <optionItems v-if="stockModalType === 'add' || stockModalType === 'edit'">
                        <template slot="right">
                            <el-button-group>
                                <iconBtn iconClass="el-icon-plus" content="新增" @click="detailAdd" type="success">新增</iconBtn>
                            </el-button-group>              
                        </template>
                    </optionItems> -->
                    <elemTable :dataList="dataList" :loading="dataLoading" :showPagination="false">
                        <el-table-column
                          type="index">
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
                        <el-table-column prop="priceForDecimal" label="基本单价(元)" width="120">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.priceForDecimal" @blur="changePrice(scope.row, true)" v-if="stockModalType === 'add' || stockModalType === 'edit'"></inputItem>
                                    <toolTip :content="scope.row.priceForDecimal" v-else>
                                        <div>{{scope.row.priceForDecimal}}元/{{scope.row.basicUnitName}}</div>
                                    </toolTip>
                                    <div style="width: 70px;" v-if="stockModalType === 'add' || stockModalType === 'edit'">元/{{scope.row.measureMethodName}}</div>
                                </div>                               
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeStockForDecimal" :label="stockType === 'in' ? '基本入库量' : '基本出库量'"  width="120">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.changeStockForDecimal" @blur="changeStock(scope.row.changeStockForDecimal, scope.row, true)" v-if="stockModalType === 'add' || stockModalType === 'edit'"></inputItem>
                                    <toolTip :content="scope.row.changeStockForDecimal" v-else>
                                        <span>{{scope.row.changeStockForDecimal}}{{scope.row.basicUnitName}}</span>
                                    </toolTip>
                                    <div style="width: 70px;" v-if="stockModalType === 'add' || stockModalType === 'edit'">{{scope.row.measureMethodName}}</div>
                                </div>                                
                            </template>
                        </el-table-column>                        
                        <el-table-column prop="priceSkuForDecimal" label="规格单价(元)" width="120">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                     <div style="width: 100%;" v-if="stockModalType === 'add' || stockModalType === 'edit'">{{scope.row.priceSkuForDecimal}}元/{{scope.row.skuMeasureMethodName}}</div>
                                    <toolTip :content="scope.row.priceSkuForDecimal" v-else>
                                        <div>{{scope.row.priceSkuForDecimal}}元/{{scope.row.skuUnitName}}</div>
                                    </toolTip>                                   
                                </div>                                
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeStockSkuForDecimal" :label="stockType === 'in' ? '规格入库量' : '规格出库量'">
                            <template slot-scope="scope">
                                <span v-if="stockModalType === 'add' || stockModalType === 'edit'">{{scope.row.changeStockSkuForDecimal}}{{scope.row.skuMeasureMethodName}}</span>
                                <span v-else>{{scope.row.changeStockSkuForDecimal}}{{scope.row.skuUnitName}}</span>                                
                            </template>
                        </el-table-column>
                        <!--<el-table-column prop="totalAmountForDecimal" label="库房" width="120">
                            <template slot-scope="scope">
                                <selectInput :clearable='true' :value.sync="scope.row.storageId">
	                                <el-option
	                                  v-for="item in storageList"
	                                  :key="item.id"
	                                  :label="item.name"
	                                  :value="item.id">
	                                </el-option>
	                            </selectInput>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="totalAmountForDecimal" label="合计金额(元)">
                            <template slot-scope="scope">
                                <span>{{scope.row.totalAmountForDecimal}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" v-if="stockModalType === 'add' || stockModalType === 'edit'">
                            <template slot-scope="scope">
                                 <elBtn type="danger" @click="deleteRow(scope.$index, scope.row)">删除</elBtn>               
                            </template>
                        </el-table-column>
                    </elemTable>
                </el-tab-pane>
            </el-tabs>                        
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel">取消</elBtn>
                <elBtn @click="valideSubmit('1')" type="primary" v-if="!submitLoading && (stockModalType === 'add' || stockModalType === 'edit')">提交</elBtn>
                <elBtn @click="valideSubmit('0')" type="success" v-if="!submitLoading && (stockModalType === 'add' || stockModalType === 'edit')">保存草稿</elBtn>
                <elBtn v-if="submitLoading" iconClass="el-icon-loading" type="primary"></elBtn>
            </div>
        </el-dialog>
        <selectSupplierModal v-if="supplierModal" :modal="supplierModal" @close="supplierModalClose" @submit="supplierModalSubmit"></selectSupplierModal> 
        <selectProductModal v-if="productModal" :modal="productModal" @close="productModalClose" @submit="productModalSubmit" :type="stockType"></selectProductModal> 
    </div>	
</template>
<script>
import mixin from '../../mixin/mixin.js'
import configs from '../../configs.js'
import local from '../../local.js'
import selectSupplierModal from './selectSupplierModal.vue'
import selectProductModal from './selectProductModal.vue'
	export default {
        mixins: [mixin],
        components: {selectSupplierModal, selectProductModal},
		data() {
			return {
                detailForm: {
                    productId: null,
                    productName: '',
                    skuId: null,
                    skuName: '',
                    changeStockForDecimal: null,
                    priceForDecimal: null,
                    totalAmountForDecimal: null,
                    comment: '',
                    measureMethodName: '',
                    skuMeasureMethodName: '',
                    basePrice: '',
                    skuWeight: ''
                },
				form: {
                    stockChangeType: '',
                    stockTitle: '',
                    supplierId: null,
                    totalAmountForDecimal: null,
                    comment: '',
                    supplierName: '',
                    stockStatus: '0',
                    storageId : '',
                },
                stockChangeTypeList: [],
                parentChannel: [],
                dataList: [],
                rules: {
                    stockChangeType: [{required: true, message: '入库类型不能为空' }],
                    stockTitle: [{required: true, message: '名称不能为空' }, this._ruleLength(50)],
                    supplierId: [{required: true, message: '供应商不能为空' }],
                    storageId:[{required: true, message: '库房不能为空' }],
                    comment: [this._ruleLength(200)],
                },
                supplierModal: false,
                productModal: false,
                tabModal: 'first',
                validConfirm: {
                    flag: true,
                    msg: ''
                },
                supplierList:[],
                stockTypeName: '入库',
                storageList : [],
//              user : local.get('sessionUser'),
                flag : false,
                submitLoading: false,
                storageName: ''
			}
		},
		props: {
			modal: {
				default: false
			},
            stockModalType: {
                default: 'add'
            },
            params: {
                default: function() {
                    return {}
                }
            },
            stockType: {
                default: 'in'
            },
            storageListData : {
            	default:function() {
                    return {}
                }
            }
		},
		mounted() {  
            this.stockTypeName = this.stockType === 'in' ? '入库' : '出库'
            var extendVal = this.stockType === 'in' ? '1' : '2'            
            this._ajax({name: 'datadic/listAll', param: { dataType: 'STOCK_STATUS', extendVal: extendVal, enabled: 1}})
            .then((function(d) {
                this.stockChangeTypeList = this._dicKey(d)
                if(!this.params.id)
                	this.form.stockChangeType = this.stockChangeTypeList[0].key
            }).bind(this))
            Object.assign(this.form, this.params)
//          console.info(this.params)
            Object.assign(this.storageList, this.storageListData)
            this.form.storageId = this.storageList[0].id;
            if(this.form.stockChangeType) {
                Object.assign(this.form, {
                    stockChangeType: parseInt(this.form.stockChangeType)
                })
            }  

            if(this.stockModalType !== 'add') {
	            this._ajax({name: 'inoutstockdetail/list', param: { mainId: this.form.id}, loading: 'dataLoading'})
	            .then((function(d) {
	                this.dataList = d.aaData
	                this.dataList.forEach((function(el) {
	                    if(!el.priceForDecimal) {
	                        el.priceForDecimal = el.avgPriceForDecimal
	                        this.orderSum(el, false)
	                    }
	                    el.measureMethodName = el.basicUnitName
	                    el.skuMeasureMethodName = el.skuUnitName
	                }).bind(this))
	                this.totalSum();
	            }).bind(this))
                if(this.form.supplierId) {
                    this._ajax({name: 'supplier/list', param: {id: this.form.supplierId}})
                        .then((function(d) {
                            if(d.aaData.length > 0) {
                                Object.assign(this.form, {
                                    supplierName: d.aaData[0].name
                                })
                            }
                        }).bind(this))
                }                   
            }
            if(this.stockModalType === 'add' || this.stockModalType === 'edit') {
                this._ajax({name: 'supplier/list', param: {enabled: 1}})
                .then((function(d) {
                    this.supplierList = d.aaData;
                }).bind(this))
            }            
            if(this.stockModalType === 'edit') {
                this._ajax({name: 'supplier/list', param: {enabled: 1}})
                .then((function(d) {
                    this.supplierList = d.aaData;
                }).bind(this))
            }
            if(this.stockModalType === 'check' && this.params.storageId) {
                this._ajax({name: 'storage/list', param: {id: this.params.storageId}})
                .then((function(d) {
                    if(d.aaData.length > 0) {
                        this.storageName = d.aaData[0].name
                    }
                }).bind(this))
            }
            /*this._ajax({url: this.rootAPI, name: 'storage/list', param: {customerId : this.user.typeCode, enabled : 1}})
             .then((function(d) {
                this.storageList = d.aaData
            }).bind(this))*/
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			valideSubmit(state) {
                this.$refs['form'].validate((valid) => {
                	if(this.submitLoading) {
                		this.$message({type: 'info', message: '数据正在提交，请勿重复操作！'});
                	}
                    if (valid && !this.submitLoading) {
                    	this.submitLoading = true;
                        if(this.dataList.length <= 0) {
                            this.$message({type: 'info', message: '请添加明细'});
                            this.submitLoading = false
                        }else {
                            this.submit(state)
                        }
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            submit(state) {
                this.tableFormValid()
                this.dataList.forEach((function(el) {
                    this.changePrice(el, false)
                    this.changeStock(el.changeStockForDecimal, el, false)
                }).bind(this))
                this.totalSum();
                if(!this.validConfirm.flag) {
                    this.$message({type: 'warning', message: '输入有误'});
                    this.submitLoading = false;
                }else {
                    Object.assign(this.form, {
                        stockStatus: state,
                        stockCategoryNum : this.dataList.size
                    })
                    this._saveStock(this.form, this.dataList)
                    .then((function(d) {
                        if(d.state === 0) {
                            this.$message({type: 'success', message: '操作完成'});
                            this.$emit('submit')
                        } else {
                        	this.$message({type: 'warning', message: '操作失败：'+d.msg});
                        	this.submitLoading = false;
                        }
                    }).bind(this))
                }                                                
            },
            selectSupplier() {
                this.supplierModal = true
            },
            supplierModalClose() {
                this.supplierModal = false
            },
            supplierModalSubmit(row) {
                Object.assign(this.form, {
                    supplierId: row.id,
                    supplierName: row.name
                })
                this.supplierModal = false
            },
            detailAdd() {
                this.changeStock(this.detailForm.changeStockForDecimal, null, true)
                if(!this.validConfirm.flag || this.detailForm.productId === null ) {
                    this.$message({type: 'warning', message: this.validConfirm.msg});
                }else {
                    var totalAmount = this._parseFloat(this.detailForm.priceForDecimal.mul(this.detailForm.changeStockForDecimal), 2)
                    var changeStockSkuForDecimal = this._parseFloat(this.detailForm.changeStockForDecimal.div(this.detailForm.skuWeight), 2)
                    var basePrice = this._parseFloat(this.detailForm.priceForDecimal.mul(this.detailForm.skuWeight), 2)
                    var o = {
                        productId: this.detailForm.productId,
                        productName: this.detailForm.productName,
                        skuId: this.detailForm.skuId,
                        skuName: this.detailForm.skuName,
                        changeStockForDecimal: this.detailForm.changeStockForDecimal,
                        priceForDecimal: this.detailForm.priceForDecimal,
                        totalAmountForDecimal: totalAmount,
                        comment: this.detailForm.comment,
                        measureMethodName: this.detailForm.measureMethodName,
                        priceSkuForDecimal: basePrice,
                        skuMeasureMethodName: this.detailForm.skuMeasureMethodName,
                        changeStockSkuForDecimal: changeStockSkuForDecimal,
                        skuWeight: this.detailForm.skuWeight,
                        basePrice: this.detailForm.basePrice,
                        storageId: this.form.storageId,
                    }
                    this.dataList.push(o)
                }             
            },
            selectProduct() {
                this.productModal = true
            },
            productModalClose() {
                this.productModal = false
            },
            productModalSubmit(rows) {
            	let vm = this;
            	let msgTemp = '';
            	this.flag = false;
                rows.forEach((function(el) {
                    Object.assign(this.detailForm, {
                        productId: el.id,
                        productName: el.name,
                        skuId: el.skuID,
                        skuName: el.skuName,
                        priceForDecimal: this.stockType === 'in' ? el.basePrice : el.stockAvgPrice ? el.stockAvgPrice.div(100) : el.basePrice,
                        changeStockForDecimal: 1,
                        measureMethodName: el.measureMethodName,
                        basePrice: el.price,
                        skuWeight: el.skuWeight,
                        skuMeasureMethodName: el.skuMeasureMethodName,
                    })
                    vm.dataList.forEach((function(el1) {
	            		if(el1.skuId == vm.detailForm.skuId) {
	            			this.flag = true;
	            			msgTemp += vm.detailForm.productName + "-" + vm.detailForm.skuName + ";";
	            		}
	        		}).bind(this)) 
	        		if(!this.flag)
                    	this.detailAdd()
                }).bind(this))
                if(this.flag) {
        			this.$message({type: 'warning', message: msgTemp + '已存在详细列表，请重新选择商品。'});
        			return;
        		}
            	this.productModal = false
            },
            changeStock(val, row, isSubmit) {
                if(!this.regFloatPlus.test(val) || val <= 0 || val > 99999.99) {
                    this.$message({type: 'warning', message: '请输入大于0,小于100000的两位小数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '需求数量输入不合法'
                    })
                }else {
                	if(!row) {
                		this.dataList.forEach((function(el) {
	                        this.orderSum(el, isSubmit)
	                    }).bind(this))     
                	} else {
                		this.orderSum(row, isSubmit)
                	}
                }
            },
            changeComment(val) {
                if(val.length > 200) {
                    this.$message({type: 'warning', message: '备注输入长度不得超过200个字符'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '备注输入长度不得超过200个字符'
                    })
                }
            },
            tableFormValid() {
                Object.assign(this.validConfirm, {
                    flag: true,
                    msg: ''
                })                
            },
            deleteRow($index, row) {
                var arr = []
                this.dataList.forEach(function(item, index) {
                    if(index !== $index) {
                        arr.push(item)
                    }
                })
                this.dataList = arr 
            },
            changePrice(row, isSubmit) {
                if(!this.priceFloat.test(row.priceForDecimal) || row.priceForDecimal <= 0 || row.priceForDecimal > 99999) {
                    this.$message({type: 'warning', message: '请输入大于0,小于100000的数字，小数位数不超过两位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '价格输入不合法'
                    })
                }else {
                    this.orderSum(row, isSubmit)
                }
            },
            orderSum(row, isSubmit) {
                row.totalAmountForDecimal = this._parseFloat(row.changeStockForDecimal.mul(row.priceForDecimal), 2)    
                row.changeStockSkuForDecimal = this._parseFloat(row.changeStockForDecimal.div(row.skuWeight), 2)
                row.priceSkuForDecimal = this._parseFloat(row.priceForDecimal.mul(row.skuWeight), 2)
                if(!isSubmit) {
                	this.totalSum();
                }
            },
            totalSum() {
            	var totalAmountForDecimal = 0
                this.dataList.forEach(function(el) {
                    totalAmountForDecimal = totalAmountForDecimal.add(el.totalAmountForDecimal)
                })
                Object.assign(this.form, {
                    totalAmountForDecimal: this._parseFloat(totalAmountForDecimal, 2)
                })
            },
            storageChange(val) {
            	this.dataList.forEach((function(el) {
                    el.storageId = val;
                }).bind(this))     
            },
            supplierChange(val) {
            	$.each(this.supplierList, (function(index, obj) {
            		if(obj.id = val) {
            			this.form.supplierName = obj.name;
            		}
            	}).bind(this));
            },
		}
	}
</script>
<style lang="sass">
    .stock-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 110px);
                &>div{
                    width: 100%;
                }
            }
            .option-box{
                width: 100%;
                .search-input-item-content {
                    width: calc(100% - 120px);
                }
            }            
        }
    }
</style>