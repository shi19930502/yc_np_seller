<template>
    <div class="inMarketDetailModal-modal">
        <el-dialog custom-class="jz-modal" width="70%" :title="title" :close-on-click-modal='false' :visible="modal"
                   :before-close='beforeClose'>
            <el-form class="modal-form" ref="form" v-if="modal" :model="form" :inline="true" :rules="rules"
                     label-width="120px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item class="is-required" label="商户名称:">
                            <inputItem :disabled='formDisabled' :value.sync='form.wholesalerName'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="进场日期:"
                                      v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                      prop="inDate">
                            <el-date-picker v-model="form.inDate" type="datetime" valueFormat="yyyy-MM-dd hh:mm:ss"
                                            placeholder="进场日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="进场日期:" prop="inDate" v-else>
                            <inputItem :disabled='formDisabled' :value.sync='form.inDate'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item class="is-required" label="进场凭证类型:" v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='voucherValueSelected'></inputItem>
                        </el-form-item>
                        <el-form-item class="is-required" label="进场凭证类型:" v-else>
                            <selectInput :value.sync="form.voucherType" v-on:selectChange='voucherChange'
                                         v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'">
                                <el-option v-for="item in voucherList" :key="item.key" :label="item.value" 
                                           :value="item.key">
                                </el-option>
                            </selectInput>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item class="is-required" v-bind:label="voucherValueSelected + ':'"
                                      v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='voucherInput'></inputItem>
                        </el-form-item>
                        <el-form-item class="is-required" v-bind:label="voucherValueSelected + ':'"
                                      prop="voucherInputRule" v-else>
                            <inputItem :value.sync='voucherInput' @change='voucherInputBlur'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="运输车牌号:" class="is-required" v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.transporterId'></inputItem>
                        </el-form-item>
                        <el-form-item label="运输车牌号:" prop="transporterId" v-else>
                            <inputItem :value.sync='form.transporterId'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="生产基地:" class="is-required" v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.baseName'></inputItem>
                        </el-form-item>
                        <el-form-item label="生产基地:" prop="baseName" v-else>
                            <inputItem :value.sync="form.baseName">
                            </inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="进场重量(千克):" class="is-required"
                                      v-if="inMarketDetailModalType === 'check' && form.statusId>0">
                            <inputItem :disabled='formDisabled' :value.sync='form.inWeight'></inputItem>
                        </el-form-item>
                        <el-form-item label="进场重量(千克):" class="is-required" prop="inWeightRule"
                                      v-if="(inMarketDetailModalType === 'add'|| extendModalType === 'fastAdd')&& frontEndId===2">
                            <inputItem :value.sync='form.inWeight'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="出场重量(千克):" class="is-required"
                                      v-if="inMarketDetailModalType === 'check' && form.statusId===2">
                            <inputItem :disabled='formDisabled' :value.sync='form.outWeight'></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
                        <el-form-item label="产地:" class="is-required" v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.areaName'></inputItem>
                        </el-form-item>
                        <el-form-item label="产地:" class="is-required" prop="areaNameProvince" v-else>
                            <selectInput :value.sync="areaNameProvince" v-on:selectChange='provinceChange'>
                                <el-option v-for="item in addressList" :key="item.areaCode" :label="item.areaName"
                                           :value="item.areaCode">
                                </el-option>
                            </selectInput>
                            <selectInput :value.sync="areaNameCity" v-on:selectChange='cityChange'>
                                <el-option v-for="item in cityList" :key="item.areaCode" :label="item.areaName"
                                           :value="item.areaCode">
                                </el-option>
                            </selectInput>
                            <selectInput :value.sync="areaNameCountry" v-on:selectChange='countryChange'>
                                <el-option v-for="item in districList" :key="item.areaCode" :label="item.areaName"
                                           :value="item.areaCode">
                                </el-option>
                            </selectInput>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="凭证图片:" v-if="inMarketDetailModalType === 'check'">
                            <imgItem :path="form.voucherPic"></imgItem>
                        </el-form-item>
                        <el-form-item label="凭证图片:" v-else>
                            <uploadItem buttonType="icon" @success="uploadSuccess" :uploadData="uploadData"
                                        @remove="uploadRemove" :fileList="uploadList" uploadTip=""
                                        accept='.jpg,.png'></uploadItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="上传时间:" v-if="inMarketDetailModalType === 'check'">
                            <inputItem :disabled='formDisabled' :value.sync='form.uploadDate'></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-tabs v-model="tabModal">
                <el-tab-pane label="进场明细" name="first">
                    <searchInputItems v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'">
                        <searchInputItem name="选择商品">
                            <inputItem :append="true" :readonly="true" placeHolder="请选择商品">
                                <elBtn iconClass="el-icon-search" slot="append" @click="selectProCategory"></elBtn>
                            </inputItem>
                        </searchInputItem>
                    </searchInputItems>
                    <elemTable :dataList="inMarketProductDataList" @sizeChange='inMarketProductHandleSizeChange'
                               @currentChange='inMarketProductHandleCurrentChange'
                               :currentPage='inMarketProductPageNum' :pageSizes='pageSizes'
                               :pageSize='inMarketProductPageSize' type="text"
                               :pageTotal='inMarketProductPageTotal' :tableBorder="tableBorder" :showPagination="false"
                               :highlightCurrentRow="true">
                        <el-table-column show-overflow-tooltip property="productName" label="商品名称"
                                         min-width="80"></el-table-column>
                        <el-table-column show-overflow-tooltip property="skuName" label="规格名称"
                                         min-width="80"></el-table-column>

                        <el-table-column show-overflow-tooltip prop="weight" label="重量(千克)" min-width="60"
                                         class="is-required">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.weight"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="changeWeight(scope.row.weight)"></inputItem>
                                    <div v-else>{{scope.row.weight}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="price" class="is-required" label="单价(元)"
                                         min-width="60">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.price"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="changePrice(scope.row.price)"></inputItem>
                                    <div v-else>{{scope.row.price}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="tranId" label="交易凭证号" min-width="100">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.tranId"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="checkLength(scope.row.tranId,'交易凭证号')"></inputItem>
                                    <div v-else>{{scope.row.tranId}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="animalQuarantineId" label="动物产品检疫合格证号"
                                         min-width="100">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.animalQuarantineId"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="checkLength(scope.row.animalQuarantineId,'动物产品检疫合格证号')"></inputItem>
                                    <div v-else>{{scope.row.animalQuarantineId}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="meatInspectionId" label="肉类检疫合格证号" min-width="100">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.meatInspectionId"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="checkLength(scope.row.meatInspectionId,'肉类检疫合格证号')"></inputItem>
                                    <div v-else>{{scope.row.meatInspectionId}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="provId" label="产地证明号" min-width="100">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.provId"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="checkLength(scope.row.provId,'产地证明号')"></inputItem>
                                    <div v-else>{{scope.row.provId}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="vegInspectionId" label="检测合格证号" min-width="100">
                            <template slot-scope="scope">
                                <div class="flex-y-center">
                                    <inputItem :value.sync="scope.row.vegInspectionId"
                                               v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'"
                                               @blur="checkLength(scope.row.vegInspectionId,'检测合格证号')"></inputItem>
                                    <div v-else>{{scope.row.vegInspectionId}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip property="batchId" label="批次号" min-width="100"
                                         v-if="inMarketDetailModalType === 'check'"></el-table-column>
                        <el-table-column show-overflow-tooltip property="originaInspectionId" label="外埠肉检疫证号"
                                         min-width="100" v-if="inMarketDetailModalType === 'check'"></el-table-column>
                        <el-table-column prop="statusName" label="进场状态" v-if="inMarketDetailModalType === 'check'">
                            <template slot-scope="scope">
                                <span>{{scope.row.statusName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right"
                                         v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'">
                            <template slot-scope="scope">
                                <elBtn type="danger" @click="deleteRow(scope.$index, scope.row)">删除</elBtn>
                            </template>
                        </el-table-column>
                    </elemTable>
                    <div class="flex-x-end">
                        <el-pagination
                                @size-change="inMarketProductHandleSizeChange"
                                @current-change="inMarketProductHandleCurrentChange"
                                :current-page="inMarketProductPageNum"
                                :page-sizes="pageSizes"
                                :page-size="inMarketProductPageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="inMarketProductPageTotal">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer flex-x-end"
                 v-if="inMarketDetailModalType === 'add' || inMarketDetailModalType === 'edit'">
                <elBtn @click="cancel">取消</elBtn>
                <elBtn type="primary" @click="submit">提交</elBtn>
            </div>
        </el-dialog>
        <selectProCategoryModal v-if="proCategoryModal" :modal="proCategoryModal" :parentDataList="dataListTemp"
                                @close="proCategoryModalClose"
                                @submit="proCategoryModalSubmit"></selectProCategoryModal>
        <selectWholesalerModal v-if="wholesalerModal" :modal="wholesalerModal" @close="wholesalerModalClose"
                               @submit="wholesalerModalSubmit"></selectWholesalerModal>
    </div>
</template>

<script>
    import mixin from '../../mixin/mixin.js' //公共方法，包括主要的ajax
    import local from '../../local.js'
    import configs from '../../configs.js'
    import selectWholesalerModal from './selectWholesalerModal.vue'
    import selectProCategoryModal from './selectProCategoryModal.vue'

    export default {
        mixins: [mixin],
        components: {selectWholesalerModal, selectProCategoryModal},
        props: {
            modal: {
                default: false,
            },
            inMarketDetailModalType: {
                default: 'add'
            },
            extendModalType: {
                default: ""
            },
            tableRow: {
                default: function () {
                    return {}
                },
            }
        },
        data() {
            return {
                dataListTemp: [],
                dataSkuIdListTemp: [],
                inMarketProductDataList: [],
                inMarketProductPageNum: 1,
                inMarketProductPageTotal: 0,
                inMarketProductPageSize: 10,
                frontEndId: configs.frontEndId,
                wholesalerModal: false,
                proCategoryModal: false,
                formDisabled: true,
                title: "",
                areaNameCountry: "",
                areaNameCity: "",
                areaNameProvince: "",
                addressList: [],
                cityList: [],
                districList: [],
                tableBorder: true,
                voucherList: [],
                voucherInput: '', //进场凭证类型
                voucherKeySelected: '005', //选中进场凭证类型key
                voucherValueSelected: '检测合格证号', //选中进场凭证类型value
                form: {
                    channelCode: '',
                    inDate: this.formatDateTime(new Date()),
                    // uploadDate: this.formatDateTime(new Date()),
                    wholesaleMarketName: '北环批发市场',
                    wholesaleMarketId: '510100002',
                    wholesalerId: null,
                    wholesalerName: '',
                    voucherType: '005', //进场凭证类型
                    voucherPic: '', //进场凭证图片
                    inWeight: '',
                },
                uploadfile: {
                    id: '',
                    filePath: '',
                    fileSize: '',
                    fileName: '',
                    fileType: ''
                },
                uploadList: [],
                uploadData: {
                    savePath: 'inMarket'
                },
                tabModal: 'first',
                validConfirm: {
                    flag: true,
                    msg: ''
                },
                rules: {
                    inDate: [{required: true, message: '进场日期不能为空'}],
                    baseName: [{required: true, message: '生产基地不能为空'}, this._ruleLength(50)],
                    voucherInputRule: [this.checkVoucherInputRule(), this._ruleLength(20)],
                    transporterId: [{required: true, message: '运输车牌号不能为空'}, this._ruleLength(20)],
                    areaNameProvince: [this.checkAreaNameProvince()],
                    inWeightRule: [this.checkInWeight()],
                }
            };
        },
        mounted() {
            this.initTitle();
            this.init();
        },
        methods: {
            modalForm() {
                this._ajax({
                    url: this.rootAPI,
                    name: 'inmarketmain/list',
                    param: {
                        id: this.tableRow.id
                    }
                }).then((d) => {
                    this.form = d.aaData[0];
                })
            },
            checkVoucherInputRule() {
                return {
                    validator: (function (rule, value, callback) {
                        if (!this.voucherInput) {
                            callback(new Error(this.voucherValueSelected + '不能为空'));
                        } else {
                            callback();
                        }
                    }.bind(this)),
                    trigger: 'blur'
                }
            },
            checkAreaNameProvince() {
                return {
                    validator: (function (rule, value, callback) {
                        if (!this.areaNameProvince || (!this.areaNameCity && this.cityList.length > 0) || (!this.areaNameCountry && this.districList.length > 0)) {
                            callback(new Error('产地不能为空，且必须具体到县级'));
                        } else {
                            callback();
                        }
                    }.bind(this))
                }
            },
            initTitle() {
                if (this.inMarketDetailModalType === 'add' && this.extendModalType == '') {
                    this.title = '新增进场记录';
                } else if (this.inMarketDetailModalType === 'edit' && this.extendModalType == '') {
                    this.title = '编辑进场记录';
                } else if (this.inMarketDetailModalType === 'edit' && this.extendModalType == 'fastAdd') {
                    this.title = '快速新建进场记录';
                } else if (this.inMarketDetailModalType === 'add' && this.extendModalType == 'record') {
                    this.title = '订单补录进场记录';
                } else {
                    this.title = '进场详情';
                }
            },
            initCurrCustomer() {
                let user = local.get('sessionUser');
                if (null != user.typeCode && user.typeCode != '001' && user.typeCode != '') {
                    //超级管理员
                    this._ajax({
                        url: this.rootAPI,
                        name: 'customer/queryById',
                        param: {
                            id: user.typeCode,
                        }
                    })
                        .then((function (d) {
                            this.form.wholesalerId = d.aaData.code;
                            this.form.wholesalerName = d.aaData.name;
                        }).bind(this))
                }
            },
            initDetail() {
                if ('add' != this.inMarketDetailModalType) {
                    this.form = this.tableRow;
                    this.voucherInput = this.tableRow.vegInspectionId;
                    if ("fastAdd" == this.extendModalType) {
                        this.form.inDate = this.formatDateTime(new Date());
                    }
                    this.initVoucher();
                    this.initEditArea();
                    this.searchTable();
                } else {
                    this.initVoucher();
                    let user = local.get('sessionUser');
                    // this.form.channelCode = user.typeCode;
                    if ("record" == this.extendModalType) {
                        this.initRecordProduct();
                    }
                }
                this.voucherInputBlur();
            },
            initVoucher() {
                this._ajax({
                    url: this.rootAPI,
                    name: 'datadic/list',
                    param: {
                        dataType: "VOUCHER_TYPE"
                    },
                    loading: 'dataLoading'
                })
                    .then((function (d) {
                        this.voucherList = d.aaData;
                        this.voucherKeySelected = this.form.voucherType;
                        let currVoucher = this.voucherList.find((item) => {
                            return item.key === this.form.voucherType;
                        });
                        this.voucherValueSelected = currVoucher.value;
                        this.initVoucherInput();
                        if ('edit' == this.inMarketDetailModalType && "" != this.form.voucherPic) {
                            this.uploadList = [];
                            this.uploadList.push({"name": "凭证", "url": configs.imgURL + this.form.voucherPic});
                        }
                    }).bind(this))
            },
            initEditArea() {
                let row = this.form;
                if (null != row.areaId) {
                    let areaArr = row.areaId.split('-');
                    let areaNameArr = row.areaName.split('-');
                    let currLevel = areaArr.length;
                    switch (currLevel) {
                        case 1:
                            this.areaNameProvince = areaArr[0];
                        case 2:
                            this.provinceChange(row);
                            this._ajax({
                                url: this.rootAPI,
                                name: 'comArea/list',
                                param: {
                                    parentAreaCode: areaArr[0],
                                    level: 2
                                }
                            }).then((d) => {
                                this.cityList = d.aaData
                                this.areaNameCity = areaArr[1];
                                this.areaNameProvince = areaArr[0];
                            })
                        case 3:
                            this._ajax({
                                url: this.rootAPI,
                                name: 'comArea/list',
                                param: {
                                    parentAreaCode: areaArr[0],
                                    level: 2
                                }
                            }).then((d) => {
                                this.cityList = d.aaData
                                if (this.cityList.length > 0) {
                                    this._ajax({
                                        url: this.rootAPI,
                                        name: 'comArea/list',
                                        param: {
                                            parentAreaCode: areaArr[1],
                                            level: 3
                                        }
                                    }).then((d) => {
                                        this.districList = d.aaData
                                        this.areaNameCountry = areaArr[2];
                                        this.areaNameCity = areaArr[1];
                                        this.areaNameProvince = areaArr[0];
                                        this.countryChange();
                                    })
                                }
                            })
                    }
                }
            },
            searchTable() {
                if (this.tableRow && this.tableRow.id) {
                    this._ajax({
                        url: this.rootAPI,
                        name: 'inmarketdetail/list',
                        param: {
                            pageNum: 1,
                            pageSize: 10000,
                            mainId: this.tableRow.id
                        }
                    }).then((function (d) {
                        if (d.aaData.length > 0) {
                            d.aaData.forEach((function (row) {
                                var index = this.dataSkuIdListTemp.indexOf(row.skuId);
                                if (index < 0) {
                                    this.dataListTemp.unshift(row);
                                    this.dataSkuIdListTemp.push(row.skuId);
                                }
                            }).bind(this));
                        }
                        this.dataChange();
                    }).bind(this))
                }
                if ("record" == this.extendModalType || "add" == this.inMarketDetailModalType) {
                    this.dataChange();
                }
            },
            checkInWeight() {
                return {
                    validator: (function (rule, value, callback) {
                        let reg = /^\d{1,6}(\.\d{1,2})?$/;
                        if (!reg.test(this.form.inWeight)) {
                            callback(new Error('进场重量必填，且必须是0-1000000'))
                        } else {
                            callback();
                        }
                    }.bind(this)),
                    trigger: 'blur'
                }
            },
            changePrice(val) {
                let reg = /^\d{1,5}(\.\d{1,2})?$/;
                if (!reg.test(val)) {
                    let msg = "单价不符合规定（价格必须是0-100000）";
                    this.$message({type: 'warning', message: msg});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '单价输入不合法'
                    })
                    return false;
                } else {
                    if (this.validConfirm.msg == '单价输入不合法') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                    return true;
                }
            },
            changeWeight(val) {
                let reg = /^\d{1,5}(\.\d{1,2})?$/;
                if (!this.regFloatPlus.test(val) || val <= 0) {
                    this.$message({type: 'warning', message: '重量必填! 请输入大于0的两位小数'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                    return false;
                } else if (!reg.test(val)) {
                    let msg = "重量不符合规定（重量必须是0-100000）";
                    this.$message({type: 'warning', message: msg});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: '重量输入不合法'
                    })
                    return false;
                } else {
                    if (this.validConfirm.msg == '重量输入不合法') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                    return true;
                }
            },
            checkLength(val, typeCode) {
                let type;
                if(typeCode == '001'){
                    type = '交易凭证号';
                }
                else if(typeCode == '002'){
                    type = '动物产品检疫合格证号';
                }
                else if(typeCode == '003'){
                    type = '肉类检疫合格证号';
                }
                else if(typeCode == '004'){
                    type = '产地证明号';
                }
                else if(typeCode == '005'){
                    type = '检测合格证号';
                }
                if ((this.voucherKeySelected === typeCode && ('' == val || null == val)) || (null != val && val.length > 20)) {
                    this.$message({type: 'warning', message: type + '必填且长度不可超过20个字符'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: type + '必填且长度不可超过20个字符'
                    });
                    return false;
                } else {
                    if (this.validConfirm.msg == type + '长度不可超过20个字符') {
                        Object.assign(this.validConfirm, {
                            flag: true,
                            msg: ''
                        })
                    }
                    return true;
                }
            },
            cancel() {
                this.$emit('close')
            },
            submit() {
                var flag = false;
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.validConfirm.flag = false;
                        this.validConfirm.msg = "请填写必填字段";
                        flag = false;
                    } else {
                        this.validConfirm.flag = true;
                        flag = true;
                    }
                });
                if (!flag) {
                    return;
                }
                let details = this.dataListTemp;
                if (details.length === 0) {
                    this.$message({type: 'warning', message: "至少填写一条进场明细记录"});
                    return;
                }
                this.areaSelected();
                let itemChecked = true;
                details.forEach((function (detail) {
                    if(!this.changePrice(detail.price) || !this.changeWeight(detail.weight)){
                        itemChecked = false;
                    }
                    if(!this.checkLength(detail.tranId, "001") || !this.checkLength(detail.animalQuarantineId, "002")|| !this.checkLength(detail.meatInspectionId, "003")|| !this.checkLength(detail.provId, "004")|| !this.checkLength(detail.vegInspectionId, "005")){
                        itemChecked = false;
                    }
                    Object.assign(detail, this.copyToDetailBeforeSubmit());
                    if ("fastAdd" == this.extendModalType) {
                        detail.id = "";
                    }
                    if (1 === configs.frontEndId) {
                        detail.statusId = 0;
                    } else if (2 === configs.frontEndId) {
                        detail.statusId = 1;
                    }
                }).bind(this))
                if (!itemChecked) {
                    return;
                } else {
                    if ("fastAdd" == this.extendModalType) {
                        this.form.id = "";
                        if (1 === configs.frontEndId) {
                            this.form.inWeight = "";
                        }
                    }
                    if (1 === configs.frontEndId) {
                        this.form.statusId = 0;
                    } else if (2 === configs.frontEndId) {
                        this.form.statusId = 1;
                    }
                    this._saveInMarket(this.form, details)
                        .then((function (d) {
                            if (d.state === 0) {
                                this.$message({type: 'success', message: '操作完成'});
                                this.$emit('submit')
                                this.$emit('close')
                            }
                        }).bind(this));
                }
            },
            beforeClose(done) {
                this.$emit('close')
                done()
            },
            deleteRow($index, row) {
                var arr = []
                this.dataListTemp.forEach(function (item, index) {
                    if (index !== $index) {
                        arr.push(item)
                    }
                })
                let skuId = row.skuId;
                var index = this.dataSkuIdListTemp.indexOf(skuId);
                this.dataSkuIdListTemp.splice(index, 1);
                this.dataListTemp = arr;
                if (!this.tableRow) {
                    this.searchTable();
                } else {
                    this.dataChange()
                }
            },
            selectWholesaler() {
                this.wholesalerModal = true
            },
            wholesalerModalClose() {
                this.wholesalerModal = false
            },
            wholesalerModalSubmit(row) {
                Object.assign(this.form, {
                    wholesalerId: row.code,
                    wholesalerName: row.name
                })
                this.wholesalerModal = false
            },
            selectProCategory() {
                this.proCategoryModal = true
            },
            proCategoryModalClose() {
                this.proCategoryModal = false
            },
            proCategoryModalSubmit(rows) {
//				this.dataListTemp = []
                rows.forEach((function (row) {
                    var index = this.dataSkuIdListTemp.indexOf(row.skuId);
                    if (index < 0) {
                        var detail = {};
                        detail['productId'] = row.id;
                        detail['productName'] = row.name;
                        detail['skuId'] = row.skuId;
                        detail['skuName'] = row.skuName;
                        detail['price'] = row.basePrice;
                        Object.assign(detail, this.copyToDetail());
                        this.dataListTemp.unshift(detail);
                        this.dataSkuIdListTemp.push(row.skuId);
                    }
                }).bind(this));
                this.inMarketProductDataList = this.dataListTemp.slice((this.inMarketProductPageNum - 1) * this.inMarketProductPageSize, this.inMarketProductPageNum * this.inMarketProductPageSize);
                this.inMarketProductPageTotal = this.dataListTemp.length
                this.proCategoryModal = false;
            },
            copyToDetailBeforeSubmit() {
                var detail = {};
                detail['inDate'] = this.form.inDate;
                detail['wsSupplierId'] = this.form.wholesalerId;
                detail['wsSupplierName'] = this.form.wholesalerName;
                // detail['uploadDate'] = this.form.uploadDate;
                detail['areaId'] = this.form.areaId;
                detail['areaName'] = this.form.areaName;
                detail['baseName'] = this.form.baseName;
                return detail;
            },
            copyToDetail() {
                var detail = {};
                detail['tranId'] = this.form.tranId;
                detail['animalQuarantineId'] = this.form.animalQuarantineId;
                detail['meatInspectionId'] = this.form.meatInspectionId;
                detail['provId'] = this.form.provId;
                detail['vegInspectionId'] = this.form.vegInspectionId;
                return detail;
            },
            areaSelected() {
                let country = this.districList.find((item) => {
                    return item.areaCode === this.areaNameCountry;
                });
                let city = this.cityList.find((item) => {
                    return item.areaCode === this.areaNameCity;
                });
                let province = this.addressList.find((item) => {
                    return item.areaCode === this.areaNameProvince;
                });

                if (null != country) {
                    this.form.areaName = province.areaName + '-' + city.areaName + '-' + country.areaName;
                    this.form.areaId = province.areaCode + '-' + city.areaCode + '-' + country.areaCode;
                    return;
                }

                if (null != city) {
                    this.form.areaName = province.areaName + '-' + city.areaName;
                    this.form.areaId = province.areaCode + '-' + city.areaCode;
                    return;
                }

                if (null != province) {
                    this.form.areaName = province.areaName;
                    this.form.areaId = province.areaCode;
                    return;
                }
            },
            //省级
            init() {
                this.initCurrCustomer();
                this._ajax({
                    url: this.rootAPI,
                    name: 'comArea/list',
                    param: {
                        level: 1
                    }
                }).then((d) => {
                    this.addressList = d.aaData;
                    this.initDetail();
                });
            },
            //市级
            provinceChange() {
                this.areaNameCity = '';
                this.areaNameCountry = '';
                this.districList = [];
                this._ajax({
                    url: this.rootAPI,
                    name: 'comArea/list',
                    param: {
                        parentAreaCode: this.areaNameProvince,
                        level: 2
                    }
                }).then((d) => {
                    this.cityList = d.aaData
                    this.$refs.form.validateField('areaNameProvince');
                })
            },
            //县、区
            cityChange(row) {
                this.areaNameCountry = '';
                this._ajax({
                    url: this.rootAPI,
                    name: 'comArea/list',
                    param: {
                        parentAreaCode: row,
                        level: 3
                    }
                }).then((d) => {
                    this.districList = d.aaData
                    this.$refs.form.validateField('areaNameProvince');
                })
            },
            countryChange(row) {
                const tmpVoucherInput = this.voucherInput
                this.voucherInput = '';
                this.voucherInput = tmpVoucherInput;
            },
            voucherChange(key) {
                let currVoucher = this.voucherList.find((item) => {
                    return item.key === key;
                });
                this.voucherValueSelected = currVoucher.value;
				this.dataListTemp.forEach((function(detail) {
					if(this.voucherKeySelected == '001'){
						detail.tranId = '';
					}
					if(this.voucherKeySelected == '002'){
						detail.animalQuarantineId = '';
					}
					if(this.voucherKeySelected == '003'){
						detail.meatInspectionId = '';
					}
					if(this.voucherKeySelected == '004'){
						detail.provId = '';
					}
					if(this.voucherKeySelected == '005'){
						detail.vegInspectionId = '';
					}
				}).bind(this));
				this.voucherKeySelected = key;
				this.voucherInput = '';
				
				Object.assign(this.form, {
            		tranId : "",
	            	animalQuarantineId : "",
	            	meatInspectionId : "",
	            	provId : "",
	            	vegInspectionId : "",
	            });
            },
            voucherInputBlur() {
                if (this.voucherInput && this.voucherInput.length > 20) {
                    this.$message({type: 'warning', message: this.voucherValueSelected + '长度不可超过20个字符'});
                    Object.assign(this.validConfirm, {
                        flag: false,
                        msg: this.voucherValueSelected + '输入不合法'
                    });
                }
                switch (this.voucherKeySelected) {
                    case '001':
                        this.form.tranId = this.voucherInput;
                        this.dataListTemp.forEach((function (detail) {
                            detail.tranId = this.voucherInput;
                        }).bind(this));
                        break;
                    case '002':
                        this.form.animalQuarantineId = this.voucherInput;
                        this.dataListTemp.forEach((function (detail) {
                            detail.animalQuarantineId = this.voucherInput;
                        }).bind(this));
                        break;
                    case '003':
                        this.form.meatInspectionId = this.voucherInput;
                        this.dataListTemp.forEach((function (detail) {
                            detail.meatInspectionId = this.voucherInput;
                        }).bind(this));
                        break;
                    case '004':
                        this.form.provId = this.voucherInput;
                        this.dataListTemp.forEach((function (detail) {
                            detail.provId = this.voucherInput;
                        }).bind(this));
                        break;
                    case '005':
                        this.form.vegInspectionId = this.voucherInput;
                        this.dataListTemp.forEach((function (detail) {
                            detail.vegInspectionId = this.voucherInput;
                        }).bind(this));
                        break;
                }
            },
            initVoucherInput() {
                switch (this.voucherKeySelected) {
                    case '001':
                        this.voucherInput = this.form.tranId;
                        break;
                    case '002':
                        this.voucherInput = this.form.animalQuarantineId;
                        break;
                    case '003':
                        this.voucherInput = this.form.meatInspectionId;
                        break;
                    case '004':
                        this.voucherInput = this.form.provId;
                        break;
                    case '005':
                        this.voucherInput = this.form.vegInspectionId;
                        break;
                    default:
                        this.voucherInput = '';
                }
            },
            uploadSuccess(response, file, fileList) {
                if (response.state == 0) {
                    this.uploadfile.id = '';
                    this.uploadfile.filePath = response.aaData.path;
                    this.uploadfile.fileSize = response.aaData.size;
                    this.uploadfile.fileName = file.name;
                    let fileTypeTemp = file.name.split('.');
                    this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
                    this.uploadList = [];
                    this.uploadList.push({"name": "凭证", "url": configs.imgURL + this.uploadfile.filePath});
                    this.form.voucherPic = this.uploadfile.filePath;
                }
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    filePath: ''
                })
                this.uploadfile.filePath = '';
                this.form.voucherPic = '';
            },
            initRecordProduct() {
                let user = local.get('sessionUser');
                this._ajax({
                    url: this.rootAPI,
                    name: 'orderitem/queryProductByNoneBatchId',
                    param: {
                        sellerId: user.typeCode
                    }
                }).then((d) => {
                    this.dataListTemp = [];
                    this.dataListTemp = [];
                    this.dataSkuIdListTemp = [];
                    d.aaData.forEach((function (row) {
//                  	console.info(row)
                        var detail = {};
                        detail['productId'] = row.productId;
                        detail['productName'] = row.productName;
                        detail['skuId'] = row.skuId;
                        detail['skuName'] = row.skuName;
                        detail['price'] = row.oriPriceForDecimal;
                        detail['weight'] = 100;
                        detail['tranId'] = "";
                        detail['animalQuarantineId'] = "";
                        detail['meatInspectionId'] = "";
                        detail['provId'] = "";
                        detail['vegInspectionId'] = "";
                        this.dataListTemp.unshift(detail);
                        this.dataSkuIdListTemp.push(row.skuId);
                    }).bind(this))
                    this.dataChange();
                });
            },
            dataChange() {
                this.inMarketProductDataList = this.dataListTemp.slice((this.inMarketProductPageNum - 1) * this.inMarketProductPageSize, this.inMarketProductPageNum * this.inMarketProductPageSize);
                this.inMarketProductPageTotal = this.dataListTemp.length
            },
            formatDateTime(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                var minute = date.getMinutes();
                var ss = date.getSeconds();
                h = h < 10 ? ('0' + h) : h;
                minute = minute < 10 ? ('0' + minute) : minute;
                ss = ss < 10 ? ('0' + ss) : ss;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + ss;
            },
            inMarketProductHandleSizeChange(val) {
                this.inMarketProductPageSize = val;
                this.searchTable();
            },
            inMarketProductHandleCurrentChange(val) {
                this.inMarketProductPageNum = val;
                this.searchTable();
            },
        }
    }
</script>
<style type="text/scss" lang="sass">
    .jz-modal {
        min-width: 1218px;
    }

    .inMarketDetailModal-modal {
        .row-block {
            .el-form-item__content {
                width: calc(100% - 110px);
                &
                > div {
                    width: 100%;
                }
            }
            .option-box {
                width: 100%;

                .search-input-item-content {
                    width: calc(100% - 120px);
                }
            }
        }
    }
</style>