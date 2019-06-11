<template>
    <div>
        <el-dialog custom-class="jz-modal order-item-modal" title="订单详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="75%">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="订单号">
                            <inputItem :value.sync="form.orderUmber" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="采购商" v-if="useType === 'merchant'">
                            <inputItem :value.sync="form.buyerName" :disabled="true"></inputItem>
                        </el-form-item>
                        <el-form-item label="供应商" v-if="useType === 'buyer'">
                            <inputItem :value.sync="form.sellerName" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="配送方式">
                            <inputItem :value.sync="form.distributionTypeName" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="支付类型">
                            <inputItem :value.sync="form.payWayStatusName" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="订单总额(元)">
                            <inputItem :value.sync="form.orderTotal" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="分拣总额(元)">
                            <inputItem :value.sync="form.sortingOrderTotal" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item label="验收总额(元)">
                            <inputItem :value.sync="form.inspectedOrderTotal" :disabled="true"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-collapse v-model="activeNames" @change="handleCollapseChange">
                  <el-collapse-item>
                    <template slot="title">
                      <span v-if="collapse" class="collapse-title">展开详细</span>
                      <span v-if="!collapse" class="collapse-title">收起</span>
                    </template>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                            <el-form-item label="订单状态">
                                <inputItem :value.sync="form.orderStatusName" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                            <el-form-item label="物流状态">
                                <inputItem :value.sync="form.shippingStatusName" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                            <el-form-item label="付款状态">
                                <inputItem :value.sync="form.payStatusName" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>  
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                            <el-form-item label="配送地址">
                                <inputItem :value.sync="form.shippingAdd" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                            <el-form-item label="期望配送时间">
                                <inputItem :value.sync="form.distributionTime" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                            <el-form-item label="联系电话">
                                <inputItem :value.sync="form.buyerTel" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="实际送达时间">
                                <inputItem :value.sync="distributedDate" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="备注" class="row-block word-break">
                                <inputItem :value.sync="form.comment" :disabled="true" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row> 
                    <el-row v-if="reviewData">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="订单评价" class="row-block">
                                <inputItem :value.sync="review.reviewContent" :disabled="true" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="评价时间">
                                <inputItem :value.sync="review.reviewDate" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>                        
                    </el-row> 
                    <el-row v-if="reviewData">
                        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" v-for="item in reviewList">
                            <el-form-item :label="item.reviewName">
                                <rateItem :max="5" :disabled="true" :value.sync="item.score"></rateItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.orderStatusId == '6'">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="拒绝原因" class="row-block">
                                <inputItem :value.sync="form.cancelReason" :disabled="true" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.orderStatusId == '7'">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="取消原因" class="row-block">
                                <inputItem :value.sync="form.cancelReason" :disabled="true" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row> 
                    <el-row v-if="form.orderStatusId !== '7' && form.orderStatusId !== '6' && form.orderStatusId !== '9'">
                        <el-steps :active="stepIndex" finish-status="success">
                          <el-step :title="item.curStatusName" v-for="item in stepList" :description="item.optionDate"></el-step>
                        </el-steps>
                    </el-row>                    
                  </el-collapse-item>
                </el-collapse>                             
            </el-form>        
            <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="false" :maxHeight="modalMaxTableHeight">
                <el-table-column type="selection" width="55" v-if="useType === 'merchant'"></el-table-column>
                <el-table-column prop="productPicUrl" label="商品图片">
                    <template slot-scope="scope">
                        <!-- <imgItem :path="scope.row.skuPicUrl ? scope.row.skuPicUrl : scope.row.productPicUrl ? scope.row.productPicUrl : 'dist/pro-default.png'"></imgItem> -->
                        <img class="resp-img order-img" style="width: 54px;height: 54px;max-width: 100%;" :src="orderImg(scope.row)" @error="imgLoad">
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称">
                    <template slot-scope="scope">                    
                        <div>{{scope.row.productName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="skuName" label="规格名称">
                    <template slot-scope="scope">
                        <div>{{scope.row.skuName}}</div>
                    </template>
                </el-table-column>           
                <el-table-column prop="oriPriceForDecimal" label="基本价格(元)" :width="modalTableInputWidth">
                    <template slot-scope="scope">
                        <div class="flex-y-center">
                            <inputItem :value.sync="scope.row.oriPriceForDecimal" @blur="changeOriPrice4html(scope.row)" v-if="canEdite(0)"></inputItem>
                            <div v-if="canEdite(0)" style="width: 80px;">元/{{scope.row.baseMeasureName}}</div>
                            <div v-else>{{scope.row.oriPriceForDecimal}}元/{{scope.row.baseMeasureName}}</div>
                        </div>                   
                    </template>
                </el-table-column>            
                <el-table-column prop="priceForDecimal" label="规格价格(元)" :width="modalTableInputWidth">
                    <template slot-scope="scope">
                        <div class="flex-y-center">
                            <inputItem :value.sync="scope.row.priceForDecimal" @blur="changePrice4html(scope.row)" v-if="canEdite(0)"></inputItem>
                            <div v-if="canEdite(0)" style="width: 80px;">元/{{scope.row.skuMeasureName}}</div>
                            <div v-else>{{scope.row.priceForDecimal}}元/{{scope.row.skuMeasureName}}</div>
                        </div>                    
                    </template>
                </el-table-column>
                <el-table-column prop="chargingModel" label="计价方式">
                    <template slot-scope="scope">
                        <div>{{calChargingModel(scope.row)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="需求量" :width="modalTableInputWidth">
                    <template slot-scope="scope">
                        <div class="flex-y-center">
                            <inputItem :value.sync="scope.row.quantity" @blur="changeQuantity(scope.row)" v-if="canEdite(0)"></inputItem>
                            <div v-if="canEdite(0)" style="width: 50px;">{{scope.row.skuMeasureName}}</div>
                            <div v-else>{{scope.row.quantity}}{{scope.row.skuMeasureName}}</div>
                        </div>                    
                    </template>
                </el-table-column>
                <el-table-column prop="itemTotal" label="需求金额(元)">
                    <template slot-scope="scope">
                        <div>{{scope.row.itemTotal}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="sortingWeight" label="分拣量" :width="modalTableInputWidth">
                    <template slot-scope="scope">
                        <div class="flex-y-center">
                            <inputItem :value.sync="scope.row.sortingWeight" @blur="changeSortingWeight(scope.row)" v-if="canEdite(1)"></inputItem>
                            <div v-if="canEdite(1)" style="width: 50px;">{{scope.row.measureName}}</div>
                            <div v-else>{{scope.row.sortingWeight}}{{scope.row.measureName}}</div>
                        </div>                    
                    </template>
                </el-table-column>
                <el-table-column prop="sortingTotal" label="分拣金额(元)">
                    <template slot-scope="scope">
                        <div>{{scope.row.sortingTotal}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="inspectedWeight" label="验收量" :width="modalTableInputWidth">
                    <template slot-scope="scope">
                        <div class="flex-y-center">
                            <inputItem :value.sync="scope.row.inspectedWeight" @blur="changeInspectedWeight(scope.row)" v-if="form.orderStatusId == '3'"></inputItem>
                            <div v-if="form.orderStatusId == '3'" style="width: 50px;">{{scope.row.measureName}}</div>
                            <div v-else>{{scope.row.inspectedWeight}}{{scope.row.measureName}}</div>
                        </div>                    
                    </template>
                </el-table-column>
                <el-table-column prop="inspectedTotal" label="验收金额(元)">
                    <template slot-scope="scope">
                        <div>{{scope.row.inspectedTotal}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="batchId" label="批次号">
                    <template slot-scope="scope">
                        <div>{{scope.row.batchId}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="suyuanCode" label="溯源码">
                    <template slot-scope="scope">
                        <div>{{scope.row.suyuanCode}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注" width="250px">
                    <template slot-scope="scope">
                        <div>{{scope.row.comment}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="canEdite(0)">
                    <template slot-scope="scope">
                        <elBtn @click="delItem(scope.row)" type="danger">删除</elBtn>
                    </template>
                </el-table-column>
            </elemTable>
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn type="success" @click="addPro" v-if="canEdite(0)">添加商品</elBtn>
                <elBtn type="primary" v-if="canEdite(0)" @click="validSubmit('xiugai')">确认修改</elBtn>
                <elBtn @click="printSuyuan" @ctrlClick="printViewSuyuan">打印溯源码</elBtn>
                <elBtn @click="ldpPrint" @ctrlClick="ldpPreView">打印销货单</elBtn>                 
                <elBtn type="danger" v-if="canEdite(0)" @click="delItems">批量删除</elBtn>
                <elBtn type="primary" v-if="form.orderStatusId == '0'" @click="validSubmit('xinjian')">确认提交</elBtn>
                <elBtn type="primary" v-if="form.orderStatusId == '2'" @click="validSubmit('fahuo')">确认发货</elBtn>
                <elBtn type="success" v-if="form.orderStatusId == '1'" @click="validSubmit('fenjian')">确认分拣</elBtn>
                <!-- <elBtn type="primary" v-if="form.orderStatusId == '1' && useType === 'merchant'" @click="validSubmit('gaijia')">确认改价</elBtn> -->
                <elBtn type="primary" v-if="form.orderStatusId == '3'" @click="validSubmit('shouhuo')">确认收货</elBtn>
                <elBtn @click="cancel">取消</elBtn>
            </div>
        </el-dialog>
        <selectProductModal v-if="productModal" :modal="productModal" @close="productModalClose" @submit="productModalSubmit" type="order"></selectProductModal>
    </div>	
</template>
<script>
import mixin from '../../mixin/mixin.js'
import configs from '../../configs.js'
import mixin_ticket from "../../mixin/mixin_ticket";
import selectProductModal from './selectProductModal.vue'
import local from '../../local.js'
	export default {
        mixins: [mixin,mixin_ticket],
        components: {selectProductModal},
		data() {
			return {
                activeNames: [],
                collapse: true,
                stepList: [
                    {curStatusName: '新建', state: '0', optionDate: ''},
                    {curStatusName: '受理', state: '1', optionDate: ''},
                    {curStatusName: '分拣', state: '2', optionDate: ''},
                    {curStatusName: '发货', state: '3', optionDate: ''},
                    {curStatusName: '收货', state: '4', optionDate: ''},
                    {curStatusName: '完成', state: '5', optionDate: ''},
                    {curStatusName: '已评价', state: '8', optionDate: ''},
                ],
                stepIndex: 1,
                dataList: [],
                form: {
                    orderTotal: null,
                    sortingOrderTotal: null,
                    inspectedOrderTotal: null,
                    comment: '',
                    orderStatusId: '',
                    cancelReason: ''
                },
                printForm: {
                    orderTotal: null,
                    sortingOrderTotal: null,
                    inspectedOrderTotal: null,
                },
                review: {
                    reviewContent: '',
                    reviewPersonName: ''
                },
                reviewList: [],
                validConfirm: {
                    flag: true,
                    msg: ''
                },
                useType: this.$route.meta.useType,
                buyer: {},
                reviewData: false,
                distributedDate: '',
                productModal: false,
                filter: [],
                dataLoading2: false
			}
		},
		props: {
			modal: {
				default: false
			},
            params: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() { 

            Object.assign(this.form, this.params) 
            var buyerId = this.form.buyerId
            this._customerById(buyerId)
                .then((function(d) {
                    if(d.aaData.length > 0) {
                        this.buyer = d.aaData[0]
                    }                    
                }).bind(this))
            Object.assign(this.form, {
                orderTotal: this._priceFormat(this.form.orderTotal),
                sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
                inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
            })
            console.log(this.form.orderStatusId)
            this.searchTable()
            if(this.form.orderStatusId == 8 || this.form.orderStatusId == 5) {
                this._ajax({name: 'orderitemreview/queryReviewAndScore', param: {orderId: this.form.id}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            this.reviewData = true
                            Object.assign(this.review, d.aaData[0])
                            d.aaData[1].forEach((function(el) {
                                el.score = el.score/20
                            }).bind(this))
                            this.reviewList = d.aaData[1]
                        }                        
                    }).bind(this))
            }        
		},
		methods: {
            searchTable() {
                this._ajax({name: 'orderitem/list', param: {orderId: this.form.id}, loading: 'modalDataLoading'})
                    .then(this.renderTable)
                    .then((function() {                       
                        if(this.form.orderStatusId === '3') {
                            var arr = []
                            var inspectedOrderTotal = 0
                            this.dataList.forEach((function(el) {
                                el.inspectedWeight = el.sortingWeight
                                if((el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1) ||
                                   (el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2)) {
                                    el.inspectedTotal =this. _parseFloat(el.priceForDecimal.mul(el.inspectedWeight), 2)
                                }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                    el.inspectedTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.inspectedWeight), 2)
                                }  
                                if(el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                    el.inspectedTotal = el.inspectedTotalForDecimal
                                }           
                                inspectedOrderTotal = inspectedOrderTotal.add(el.inspectedTotal)                                
                                arr.push(el)
                            }).bind(this))
                            Object.assign(this.form, {
                                inspectedOrderTotal
                            })
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.inspectedTotal) {
                                    el.inspectedTotal = this._parseFloat(el.inspectedTotal.div(100), 2) 
                                }                                
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        } 
                        if(this.form.orderStatusId === '1') {
                            var arr = []
                            var sortingOrderTotal = 0
                            this.dataList.forEach((function(el) { 
                                if((el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 2 && el.measureTypeSKU == 2 && el.chargingModel == 2) ||
                                   (el.measureTypePro == 1 && el.measureTypeSKU == 1 && el.chargingModel == 1)) {
                                    el.sortingWeight = el.sortingWeight ? el.sortingWeight : el.quantity
                                    el.sortingTotal = this._parseFloat(el.priceForDecimal.mul(el.sortingWeight), 2)                                    
                                }else if(el.measureTypePro == 1 && el.measureTypeSKU == 2 && el.chargingModel == 1) {
                                    el.sortingWeight = el.sortingWeight ? el.sortingWeight : el.quantity.mul(el.skuQuantity)
                                    el.sortingTotal = this._parseFloat(el.oriPriceForDecimal.mul(el.sortingWeight), 2)                                    
                                } 
                                sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal)                             
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.sortingTotal) {
                                    el.sortingTotal = this._parseFloat(el.sortingTotal.div(100), 2) 
                                }                                
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        }
                        if(this.form.orderStatusId === '0') {
                            var arr = []
                            var orderTotal = 0
                            this.dataList.forEach((function(el) { 
                                el.itemTotal = this._parseFloat(el.priceForDecimal.mul(el.quantity), 2) 
                                orderTotal = orderTotal.add(el.itemTotal)                             
                                arr.push(el)
                            }).bind(this))
                            Object.assign(this.form, {
                                orderTotal
                            })
                            this.dataList = arr
                        }else {
                            var arr = []
                            this.dataList.forEach((function(el) { 
                                if(el.itemTotal) {
                                    el.itemTotal = this._parseFloat(el.itemTotal.div(100), 2)
                                }                                 
                                arr.push(el)
                            }).bind(this))
                            this.dataList = arr
                        }                  
                    }).bind(this))
                this._ajax({name: 'orderstatuschange/list', param: {orderNumber: this.form.orderUmber, changeType: '销售订单状态'}})
                    .then((function(d) { 
                        var arr = d.aaData                      
                        if(arr.length > 0) {
                            var o = arr[0]
                            this.stepIndex = parseInt(o.curStatusId) + 1
                            arr.forEach((function(el) {
                                this.stepList.forEach((function(em) {
                                    if(el.curStatusId === em.state) {
                                        Object.assign(em, {
                                            optionDate: el.optionDate
                                        })
    									if(em.curStatusName == '完成'){
    										this.distributedDate = em.optionDate;
    									}
                                    }
                                }).bind(this))
                            }).bind(this))
                        }                     
                    }).bind(this))
            },
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },  
            changeOriPrice4html(row) {
                if(!this.priceFloat.test(row.oriPriceForDecimal) || row.oriPriceForDecimal <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    var str = '价格输入不合法'
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: str
                    })                    
                }else {
                    this._ajax({name: 'mathcalc/mul', param: {a: row.oriPriceForDecimal, b: row.skuQuantity}})
                        .then((function(d) {
                            if(d.state == 0) {
                                row.priceForDecimal = d.aaData.res
                                row.price = row.priceForDecimal == null ? '' : row.priceForDecimal.mul(100)
                                row.oriPrice = row.oriPriceForDecimal == null ? '' : row.oriPriceForDecimal.mul(100)
                                this.orderSum(row)
                            }
                        }).bind(this))
                }
            },          
            changePrice4html(row) {
                if(!this.priceFloat.test(row.priceForDecimal) || row.priceForDecimal <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    var str = '价格输入不合法'
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: str
                    })
                }else {
                    this._ajax({name: 'mathcalc/div', param: {a: row.priceForDecimal, b: row.skuQuantity}})
                        .then((function(d) {
                            if(d.state == 0) {
                                row.oriPriceForDecimal = d.aaData.res
                                row.price = row.priceForDecimal == null ? '' : row.priceForDecimal.mul(100)
                                row.oriPrice = row.oriPriceForDecimal == null ? '' : row.oriPriceForDecimal.mul(100)
                                this.orderSum(row)
                            }
                        }).bind(this))
                }
            },
            changeOriPrice(row) {
                if(!this.priceFloat.test(row.oriPriceForDecimal) || row.oriPriceForDecimal <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    var str = '价格输入不合法'
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: str
                    })                    
                }else {
                    this.orderSum(row)
                }
            },          
            changePrice(row) {
                if(!this.priceFloat.test(row.priceForDecimal) || row.priceForDecimal <= 0) {
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过两位'});
                    var str = '价格输入不合法'
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: str
                    })
                }else {
                    this.orderSum(row)
                }
            },
            changeSortingWeight(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(!this.regPosPattern.test(row.sortingWeight) || row.sortingWeight <= 0 || row.sortingWeight > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的整数'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '分拣重量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }else if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) || 
                         (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1)) {
                    if(!this.weightFloat.test(row.sortingWeight) || row.sortingWeight <= 0) {
                        this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过三位'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '分拣重量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }
            },
            changeInspectedWeight(row) {
                if(!this.weightFloat.test(row.inspectedWeight) || row.inspectedWeight <= 0) {
                    console.log('------------------')
                    this.$message({type: 'warning', message: '请输入大于0的数字，小数位数不超过三位'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '验收重量输入不合法'
                    })
                }else {
                    console.log('+++++++++++++++++++++')
                    this.orderSum(row)
                }
            },
            changeQuantity(row) {
                if((row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    if(!this.regPosPattern.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的整数'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }else if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) || 
                         (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1)) {
                    if(!this.weightFloat.test(row.quantity) || row.quantity <= 0 || row.quantity > 9999999999) {
                        this.$message({type: 'warning', message: '请输入大于0小于9999999999的数字,小数位数不超过三位'});
                        Object.assign(this.validConfirm, {
                            flag: false,
                            msg: '需求数量输入不合法'
                        })
                    }else {
                        this.orderSum(row)
                    }
                }                
            },
            orderSum(row) {        
                if((row.measureTypePro == 1 && row.measureTypeSKU == 1 && row.chargingModel == 1) ||
                   (row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 2) ||
                   (row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 2)) {
                    row.sortingTotal = this._parseFloat(row.priceForDecimal.mul(row.sortingWeight), 2)
                    row.inspectedTotal =this._parseFloat(row.priceForDecimal.mul(row.inspectedWeight), 2)
                    row.itemTotal = this._parseFloat(row.priceForDecimal.mul(row.quantity), 2)
                }else if(row.measureTypePro == 1 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    row.itemTotal = this._parseFloat(row.priceForDecimal.mul(row.quantity), 2)
                    row.sortingTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.sortingWeight), 2)
                    row.inspectedTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.inspectedWeight), 2)
                }  
                if(row.measureTypePro == 2 && row.measureTypeSKU == 2 && row.chargingModel == 1) {
                    row.inspectedTotal = this._parseFloat(row.oriPriceForDecimal.mul(row.inspectedWeight), 2)
                }             
                var orderTotal = 0, sortingOrderTotal = 0, inspectedOrderTotal = 0
                this.dataList.forEach(function(el) {
                    orderTotal = orderTotal.add(el.itemTotal)
                    sortingOrderTotal = sortingOrderTotal.add(el.sortingTotal)
                    inspectedOrderTotal = inspectedOrderTotal.add(el.inspectedTotal)
                })
                Object.assign(this.form, {
                    orderTotal,
                    sortingOrderTotal,
                    inspectedOrderTotal
                })
            },
            validSubmit(state) {
                if(state === 'fenjian') {
                    this.confirm('快捷分拣将无法打印分拣小票，是否继续？', (function() {
                        var arr = []
                        this.dataList.forEach((function(el) {
                            var batchId = el.batchId
                            if(!batchId) {
                                arr.push(el.productName)
                            }
                        }).bind(this))
                        if(arr.length > 0) {
                            this.confirm('系统检测到部分商品没有进场登记信息，请确认。 ', (function() {
                                this._go('inMarketDetail')
                            }).bind(this))
                        }else {
                            this.handleSubmit(state)
                        }                        
                    }).bind(this))
                }else {
                    this.handleSubmit(state)
                }                
            },
            handleSubmit(state) {
                Object.assign(this.validConfirm, {
                    flag: true,
                    msg: ''
                })
                if(this.form.orderStatusId == '0') {
                    if(this.validConfirm.flag) {
                        // 验证需求量
                        this.dataList.forEach((function(el) {
                            this.changeQuantity(el)
                        }).bind(this))
                    }
                    if(this.validConfirm.flag) {
                        // 验证基本价
                        this.dataList.forEach((function(el) {
                            this.changeOriPrice(el)
                        }).bind(this))
                    }
                    
                }
                if(this.form.orderStatusId == '1' || this.form.orderStatusId == '2') {
                    if(this.validConfirm.flag) {
                        // 验证需求量
                        this.dataList.forEach((function(el) {
                            this.changeQuantity(el)
                        }).bind(this))
                    }
                    if(this.validConfirm.flag) {
                        // 验证规格价
                        this.dataList.forEach((function(el) {
                            this.changePrice(el)
                        }).bind(this))
                    }
                    if(this.validConfirm.flag) {
                        // 验证基本价
                        this.dataList.forEach((function(el) {
                            this.changeOriPrice(el)
                        }).bind(this))
                    }
                    if(this.validConfirm.flag) {
                        // 验证分拣量
                        this.dataList.forEach((function(el) {
                            this.changeSortingWeight(el)
                        }).bind(this))
                    }
                }
                if(this.form.orderStatusId == '3') {
                    if(this.validConfirm.flag) {
                        // 验证验收量
                        this.dataList.forEach((function(el) {
                            this.changeInspectedWeight(el)
                        }).bind(this))
                    }
                }             
                if(this.validConfirm.flag) {
                    if(state === 'fenjian') {
                        Object.assign(this.form, {orderStatusId: '2'})
                    } 
                    if(state === 'shouhuo') {
                        Object.assign(this.form, {orderStatusId: '4', shippingStatusId: '2'})
                    }
                    if(state === 'fahuo') {
                        var arr = []
                        this.dataList.forEach((function(el) {
                            var batchId = el.batchId
                            if(!batchId) {
                                arr.push(el.productName)
                            }
                        }).bind(this))
                        if(arr.length > 0) {
                            this.confirm('系统检测到部分商品没有进场登记信息，请确认。 ', (function() {
                                this._go('inMarketDetail')
                            }).bind(this))
                        }else {
                            var sessionUser = local.get('sessionUser')
                            var customerId = sessionUser.typeCode
                            this._customerById(customerId)
                                .then((function(d) {
                                    if(d.aaData.length > 0) {
                                        var customer = d.aaData[0]
                                        if(customer.isDistribution == 1) {
                                            Object.assign(this.form, {
                                                distribute: 1,
                                                distributorId: this.form.sellerId
                                            })
                                        }else {
                                            Object.assign(this.form, {
                                                shippingStatusId: '1',
                                                orderStatusId: '3'
                                            })
                                        }
                                        this.submit(state)
                                    }
                                }).bind(this))
                        }
                    }else {
                        this.submit(state)
                    }                                                            
                }else {
                    this.$message({type: 'warning', message: this.validConfirm.msg});
                }
            },
            submit(state) {
                if(state === 'shouhuo') {
                    this._batchUpdateOrderItem(this.dataList, this.params.orderStatusId)
                    .then((function(d) {
                        if(d.state === 0) {
                            var o = {}
                            Object.assign(o, this.form)
                            Object.assign(o, {
                                orderTotal: this.form.orderTotal.mul(100),
                                sortingOrderTotal: this.form.sortingOrderTotal.mul(100),
                                inspectedOrderTotal: this.form.inspectedOrderTotal.mul(100),
                            })
                            this._updateOrder(o)
                            .then((function(d) {
                                if(d.state === 0) {
                                    this.$emit('submit')
                                    this.$message({type: 'success', message: '操作完成'})
                                }else {
                                    this.$message({type: 'warning', message: d.msg})
                                }                        
                            }).bind(this))
                        }else {
                            Object.assign(this.form, {
                                orderStatusId: this.params.orderStatusId
                            })
                        }                        
                    }).bind(this))
                }else {
                    console.log(this.dataList)
                    this._batchUpdateOrderItem(this.dataList, this.params.orderStatusId)
                        .then((function(d) {
                            if(d.state === 0) {
                                var o = {}
                                Object.assign(o, this.form)
                                Object.assign(o, {
                                    orderTotal: this.form.orderTotal.mul(100),
                                    sortingOrderTotal: this.form.sortingOrderTotal.mul(100),
                                    inspectedOrderTotal: this.form.inspectedOrderTotal.mul(100),
                                })
                                this._updateOrder(o)
                                .then((function(d) {
                                    if(d.state === 0) {
                                        this.$emit('submit')
                                        this.$message({type: 'success', message: '操作完成'})
                                    }else {
                                        if(d.msg === '没有要修改的记录！') {
                                            this.$emit('submit')
                                            this.$message({type: 'success', message: '操作完成'})
                                        }else {
                                           this.$message({type: 'warning', message: d.msg}) 
                                        }
                                    }                        
                                }).bind(this))
                            }else {
                                if(d.msg === '没有要修改的记录！') {
                                    var o = {}
                                    Object.assign(o, this.form)
                                    Object.assign(o, {
                                        orderTotal: this.form.orderTotal.mul(100),
                                        sortingOrderTotal: this.form.sortingOrderTotal.mul(100),
                                        inspectedOrderTotal: this.form.inspectedOrderTotal.mul(100),
                                    })
                                    this._updateOrder(o)
                                        .then((function(d) {
                                            if(d.state === 0) {
                                                this.$emit('submit')
                                                this.$message({type: 'success', message: '操作完成'})
                                            }else {
                                                if(d.msg === '没有要修改的记录！') {
                                                    this.$emit('submit')
                                                    this.$message({type: 'success', message: '操作完成'})
                                                }else {
                                                   this.$message({type: 'warning', message: d.msg}) 
                                                }
                                            }                        
                                        }).bind(this))
                                }else {
                                    Object.assign(this.form, {
                                        orderStatusId: this.params.orderStatusId
                                    })
                                   this.$message({type: 'warning', message: d.msg}) 
                                }                                
                            }
                        }).bind(this))
                }                                
            },
            delItem(row) {
                if(this.form.orderStatusId == '0') {
                    if(this.dataList.length === 1) {
                        this._comfirm('删除所有商品后，订单也将被删除，确认删除?')
                            .then((function() {
                                return this._bathDeleteOrderItem([row.id], this.form.id)
                            }).bind(this))
                            .then((function(d) {
                                if(d.state === 0) {
                                    this.$emit('submit')
                                }                                
                            }).bind(this))
                            .catch(this._confirmCancle)
                    }else {
                        this._comfirm('确认删除商品:' + row.productName + '?')
                        .then((function() {
                            return this._bathDeleteOrderItem([row.id], this.form.id)
                        }).bind(this))
                        .then((function(d) {
                            if(d.state === 0) {
                                var arr = []
                                this.dataList.forEach((function(el) {
                                    if(el.id !== row.id) {
                                        arr.push(el)
                                    }
                                }).bind(this))
                                this.dataList = arr
                                this.dataList.forEach((function(el) {
                                    this.orderSum(el)
                                }).bind(this))
                            }                            
                        }).bind(this))
                        .catch(this._confirmCancle)
                    }
                }else if(this.form.orderStatusId == '1' || this.form.orderStatusId == '2') {
                    if(this.dataList.length === 1) {
                        this.$message({type: 'info', message: '订单应至少包含一件商品'});
                    }else {
                        this._comfirm('确认删除商品:' + row.productName + '?')
                        .then((function() {
                            return this._bathDeleteOrderItem([row.id], this.form.id)
                        }).bind(this))
                        .then((function(d) {
                            if(d.state === 0) {
                                var arr = []
                                this.dataList.forEach((function(el) {
                                    if(el.id !== row.id) {
                                        arr.push(el)
                                    }
                                }).bind(this))
                                this.dataList = arr
                                this.dataList.forEach((function(el) {
                                    this.orderSum(el)
                                }).bind(this))
                            }                            
                        }).bind(this))
                        .catch(this._confirmCancle)
                    }
                }                
            },
            delItems() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else if(this.rowSelection.length === this.dataList.length) {
                    var arr = []
                    this.rowSelection.forEach(function(el) {
                        arr.push(el.id)
                    })
                    // if(this.form.orderStatusId == '0') { 
                        this._comfirm('删除所有商品后，订单也将被删除，确认删除?')
                            .then((function() {
                                return this._bathDeleteOrderItem(arr, this.form.id)
                            }).bind(this))
                            .then((function(d) {
                                if(d.state === 0) {
                                    this.$emit('submit')
                                }
                            }).bind(this))
                            .catch(this._confirmCancle)
                    // }else {
                    //     this.$message({type: 'info', message: '订单应至少包含一件商品'});
                    // }
                }else {  
                    var arr = []
                    this.rowSelection.forEach(function(el) {
                        arr.push(el.id)
                    })                    
                    this._comfirm('确认删除?')
                        .then((function() {
                            return this._bathDeleteOrderItem(arr, this.form.id)
                        }).bind(this))
                        .then((function(d) {
                            if(d.state === 0) {
                                var arr = []
                                this.dataList.forEach((function(el) {
                                    var flag = true
                                    this.rowSelection.forEach(function(em) {
                                        if(el.id == em.id) {
                                            flag = false
                                        }
                                    })
                                    if(flag) {
                                        arr.push(el)
                                    }
                                }).bind(this))
                                this.dataList = arr
                                this.dataList.forEach((function(el) {
                                    this.orderSum(el)
                                }).bind(this))
                            }                            
                        }).bind(this))
                        .catch(this._confirmCancle)                          
                }
            },
            updateForm() {
                return this._ajax({name: 'order/listByUser', param: {
                            id: this.form.id
                        }})
                        .then((function(d) {
                            if(d.state === 0) {
                                Object.assign(this.form, d.aaData[0])
                                Object.assign(this.form, {
                                    orderTotal: this._priceFormat(this.form.orderTotal),
                                    sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
                                    inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
                                })
                            }
                        }).bind(this))
            },
            print() {
                var trs = ''
                var printHtml = ''
                this.dataList.forEach((function(el, index) {
                    let _index = index + 1
                    let skuName = el.skuName
                    let productName = el.productName
                    let skuCode = el.skuCode
                    let price = ''
                    if(el.price != null) {
                        price = el.price.div(100)
                    }
                    let quantity = el.quantity ? el.quantity + el.skuMeasureName : ''
                    let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                    let comment = el.comment ? el.comment : ''
                    let sortingTotalForDecimal = el.sortingTotalForDecimal || ''
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
                var address = this.form.distributionType == 1 ? this.form.shippingAdd : '自提'
                var distributionTime = ''
                if(this.form.distributionTimeBegin) {
                    if(this.form.distributionTimeBegin.split(":").length > 0) {
                        distributionTime = distributionTime + this.form.distributionTimeBegin.split(":")[0] + ":" + this.form.distributionTimeBegin.split(":")[1]
                    }else {
                        distributionTime = distributionTime + this.form.distributionTimeBegin
                    }                       
                }
                if(this.form.distributionTimeEnd) {
                    if(this.form.distributionTimeEnd.split(":").length > 0) {
                        distributionTime = distributionTime + "-" + this.form.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + this.form.distributionTimeEnd.split(" ")[1].split(":")[1]
                    }else {
                        distributionTime = distributionTime + "-" + this.form.distributionTimeEnd
                    }                       
                }
                var contacts = this.form.contacts || ''
                var orderTotal = this.form.orderTotal || ''
                var sortingOrderTotal = this.form.sortingOrderTotal || ''
                var sellerName = this.form.sellerName || ''
                var sellerTel = this.form.sellerTel || ''
                var customerIndex = this.form.customerIndex || ''
                var buyerTel = this.form.buyerTel || ''
                var marketTitle = this.$store.state.marketTitle || ''
                var titleName = '销货单'
                var footer1 = '分拣员'
                var footer2 = '配送员'
                var footer3 = '验收人'
                var footer4 = ''
                if(configs.hedong == 1) {
                    marketTitle = '临沂市食品追溯市场'
                    sellerName = '临沂德润食品有限公司'
                    titleName = '配送单'
                    footer1 = '配送员'
                    footer2 = '验收员'
                    footer3 = '复核员'
                    footer4 = '负责人'
                }
                printHtml = printHtml + `
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 17px;">
                        <span>${marketTitle}(${sellerName})${titleName}</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">供货商电话: ${sellerTel}</span> 
                        <span style="position: absolute;right: 0;">订单号: ${this.form.orderUmber}</span>                                         
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">购货单位: ${this.form.buyerName}</span>
                        <span style="position: absolute;right: 0;">分拣编码: ${customerIndex}</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">收货人: ${contacts}</span>
                        <span style="position: absolute;right: 0;">收货人电话: ${buyerTel}</span>                                    
                    </div>
                    <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 13px;">
                        <span style="position: absolute;left: 0;">配送地址: ${address}</span>
                        <span style="position: absolute;right: 0;">配送时间: ${distributionTime}</span>
                    </div>
                    <table style="text-align: center; border-collapse: collapse; width: 100%;">
                      <thead style="font-size:14px;">
                          <tr>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 5%">序号</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">商品名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">规格名称</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">单价(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">下单量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">分拣量</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%">分拣合计(元)</th>
                              <th style="text-align: center; border: solid 1px black;word-break:break-word;width: 35%;max-width: 35%">客户备注</th>
                          </tr>
                      </thead>
                      ${trs}
                    </table>
                    <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                        <span>订单总额(元): ${orderTotal}</span>
                        <span>实配金额(元): ${sortingOrderTotal}</span>                                    
                    </div>
                    <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
                        <span style="width: 25%;display: inline-block;">${footer1}: </span>
                        <span style="width: 25%;display: inline-block;">${footer2}: </span>
                        <span style="width: 25%;display: inline-block;">${footer3}: </span> 
                        <span style="width: 25%;display: inline-block;">${footer4}: </span>                                        
                    </div>
                `
                let length = this.dataList.length;
                this.dataList.forEach((function(el) {
                	if(el.comment != null) {
                		length = length + el.comment.length/16
                	}
                }).bind(this))
                this.poPrint('6%','5%','95%','100%',printHtml, length)
            },
             poPrint(top, left, width, height, html, length) {
	            var height = 930
	            if(length && length > 7) {
	                var count = length - 7
	                var page = Math.ceil(count/11)
	                height = height + page*930
	            }
	            if(typeof LODOP === 'undefined') {
	                this.$message({
	                    showClose: true,
	                    duration: 0,
	                    dangerouslyUseHTMLString: true,
	                    message: "<br><font color='#FF00FF' style='margin-top: 35px;float: right;'>打印控件未安装!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
	                });
	            }else {
	                LODOP.PRINT_INIT("");
	                LODOP.SET_PRINT_PAGESIZE(1,2100,height,'');
	                LODOP.ADD_PRINT_HTM(top, left, width, height, html);
	                LODOP.PRINT()
	            }
	        },
            printSuyuan() {
                var customerIndex = this.form.customerIndex || ''
                var buyerName = this.form.buyerName || ''
                var extendIndex = this.form.extendIndex || ''
                var city = ''
                if(this.rowSelection.length > 0) {
                    this.back2Top()
                    this.SelectAsDefaultPrinter((function() {
                        this.rowSelection.forEach((function(el, index) {
                            let productName = el.productName || ''
                            let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
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
                            this.Gprinter(this.generateSuyuanHtml(o), configs.suyuanURL + suyuanCode)
                        }).bind(this))
                    }).bind(this))
                }else {
                    this.$message({type: 'info', message: '请选择行'});
                }                                
            },
            calChargingModel(row) {
                if(this.measureType(row)) {
                    console.log(111)
                    row.measureName = row.skuMeasureName
                }else if(!this.measureType(row)) {
                    console.log(222)
                    row.measureName = row.baseMeasureName
                }
                if(row.chargingModel == 1) {
                    return '计重'
                }else if(row.chargingModel == 2) {
                    return '计件'
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
            handleCollapseChange() {
                this.collapse = !this.collapse
            },
            printHtml() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else {
                    var selectOrderTotal = 0, selectSortingOrderTotal = 0, selectInspectedOrderTotal = 0
                    this.rowSelection.forEach(function(el) {
                        selectOrderTotal = selectOrderTotal.add(el.itemTotal)
                        selectSortingOrderTotal = selectSortingOrderTotal.add(el.sortingTotal)
                        selectInspectedOrderTotal = selectInspectedOrderTotal.add(el.inspectedTotal)
                    })
                    var trs = ''
                    var printHtml = ''
                    this.rowSelection.forEach((function(el, index) {
                        let _index = index + 1
                        let skuName = el.skuName
                        let productName = el.productName
                        let skuCode = el.skuCode
                        let price = ''
                        if(el.price != null) {
                            price = el.price.div(100)
                        }
                        let quantity = el.quantity ? el.quantity + el.skuMeasureName : ''
                        let sortingWeight = el.sortingWeight ? el.sortingWeight + el.measureName : ''
                        let comment = el.comment ? el.comment : ''
                        let sortingTotalForDecimal = el.sortingTotalForDecimal || ''
                        let itemHTML = this._renderPrintHtml(PRINT_HTML.ORDER_ITEM, _index, productName, skuName, price, quantity, sortingWeight, sortingTotalForDecimal, comment)
                      trs = trs + itemHTML
                    }).bind(this))
                    var address = this.form.distributionType == 1 ? this.form.shippingAdd : '自提'
                    var distributionTime = ''
                    if(this.form.distributionTimeBegin) {
                        if(this.form.distributionTimeBegin.split(":").length > 0) {
                            distributionTime = distributionTime + this.form.distributionTimeBegin.split(":")[0] + ":" + this.form.distributionTimeBegin.split(":")[1]
                        }else {
                            distributionTime = distributionTime + this.form.distributionTimeBegin
                        }                       
                    }
                    if(this.form.distributionTimeEnd) {
                        if(this.form.distributionTimeEnd.split(":").length > 0) {
                            distributionTime = distributionTime + "-" + this.form.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + this.form.distributionTimeEnd.split(" ")[1].split(":")[1]
                        }else {
                            distributionTime = distributionTime + "-" + this.form.distributionTimeEnd
                        }                       
                    }
                    var contacts = this.form.contacts || ''
                    var orderTotal = this.form.orderTotal || ''
                    var sortingOrderTotal = this.form.sortingOrderTotal || ''
                    var sellerName = this.form.sellerName || ''
                    var sellerTel = this.form.sellerTel || ''
                    var customerIndex = this.form.customerIndex || ''
                    var buyerTel = this.form.buyerTel || ''
                    var marketTitle = this.$store.state.marketTitle || ''
                    var titleName = '销货单'
                    var footer1 = '分拣员'
                    var footer2 = '配送员'
                    var footer3 = '验收人'
                    // <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 17px;">
                    //         <span>${marketTitle}(${sellerName})${titleName}</span>                                    
                    //     </div>
                    printHtml = printHtml + this._renderPrintHtml(PRINT_HTML.ORDER_MAIN, 
                        marketTitle + titleName, 
                        sellerTel, 
                        this.form.orderUmber, 
                        this.form.buyerName, 
                        customerIndex, 
                        contacts, 
                        buyerTel, 
                        address,
                        distributionTime,
                        trs,
                        selectOrderTotal,
                        orderTotal,
                        selectSortingOrderTotal,
                        sortingOrderTotal,
                        footer1,
                        footer2,
                        footer3)
                    return printHtml;
                }
                
            },
            ldpPrint() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else {
                    var printHtml = this.printHtml()
                    this.lodopoPrint('6%','5%','95%','100%',printHtml, this.dataList.length)
                }                
            },
            ldpPreView() {
                if(this.rowSelection.length === 0) {
                    this.$message({type: 'info', message: '请选择行'});
                }else {
                    var printHtml = this.printHtml()
                    this.lodopoPreview('6%','5%','95%','100%',printHtml, this.dataList.length)
                }                
            },
            printViewSuyuan() {
                var customerIndex = this.form.customerIndex || ''
                var buyerName = this.form.buyerName || ''
                var extendIndex = this.form.extendIndex || ''
                var city = ''
                if(extendIndex) {
                    extendIndex = `(${extendIndex})`
                }
                if(this.rowSelection.length > 0) {
                    this.back2Top()
                    this.SelectAsDefaultPrinter((function() {
                        this.rowSelection.forEach((function(el, index) {
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
                            this.GprinterPreview(html, configs.suyuanURL + suyuanCode)
                            // console.log(configs.suyuanURL + suyuanCode)
                        }).bind(this))
                    }).bind(this))
                }
            },
            orderImg(orderitem) {
                var picUrl = '../../../lib/img/pro-default.png'
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
            canEdite(i) {
                if(this.form.distributorId) {
                    return false
                }
                if(i == 0) {
                    return this.form.orderStatusId == '0' || this.form.orderStatusId == '1' || this.form.orderStatusId == '2'
                }else if(i = 1) {
                    return this.form.orderStatusId == '1' || this.form.orderStatusId == '2'
                }                
            },
            addPro() {               
                this.productModal = true
            },
            productModalClose() {
                this.productModal = false
            },
            productModalSubmit(rows) {
                var arr = []
                rows.forEach((function(el) {
                    var flag = true
                    this.dataList.forEach((function(em) {
                        if(em.skuId == el.skuID) {
                            flag = false
                        }
                    }).bind(this))
                    if(flag) {
                        var o = Object.assign({}, el)
                        arr.push(o)
                    } 
                }).bind(this))
                arr.forEach((function(em) {
                    Object.assign(em, {
                        oriPrice: em.basePrice,
                        skuId: em.skuId,
                        productId: em.id,
                        quantity: 0,
                        price: em.price.mul(100),
                        oriPrice: em.basePrice.mul(100),
                        id: null,
                        itemTotal: em.priceForDecimal
                    })
                }).bind(this))
                if(arr.length > 0) {
                    this.$store.dispatch('areaLoading', true)
                    this._ajax({name: 'orderitem/addOrderItem', param: {
                            buyerId: this.form.buyerId,
                            sellerId: this.form.sellerId,
                            orderId: this.form.id,
                            orderNumber: this.form.orderUmber,
                            orderitems: JSON.stringify(arr)
                        }})
                        .then((function(d) {
                            this.$store.dispatch('areaLoading', false)
                            if(d.state === 0 && d.aaData.length > 0) {
                                var items = d.aaData, arr = []
                                items.forEach((function(el) {
                                    var flag = true
                                    this.dataList.forEach((function(em) {
                                        if(em.id == el.id) {
                                            flag = false
                                        }
                                    }).bind(this))
                                    if(flag) {
                                        arr.push(el)
                                    }
                                }).bind(this))
                                arr.forEach((function(em) {
                                    this.dataList.push(em)
                                }).bind(this))
                                this.dataList.forEach((function(em) {
                                   this.orderSum(em)   
                                }).bind(this))                                           
                                this.productModalClose()
                            }else {
                                this.$message({type: 'warning', message: d.msg}) 
                            }
                        }).bind(this))
                }else {
                    this.productModalClose()
                }
            },
		}
	}
</script>
<style lang="sass">
    .order-item-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 100px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
</style>
