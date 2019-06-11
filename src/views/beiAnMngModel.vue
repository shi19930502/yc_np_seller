<template>
    <div class="jibenxinxi">
        <el-tabs>
            <!--店铺信息-->
            <el-tab-pane label="基本信息">
                <el-form v-if="showForm" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="渠道">
                                <selectInput :value.sync="form.channelCode" :disabled="true">
                                    <el-option
                                            v-for="item in channelList"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="所属市场" prop="marketId" >
		                        <selectInput :value.sync="form.marketId" :disabled="true">
									<el-option
								      v-for="item in marketList"
								      :key="item.marketName"
								      :label="item.marketName"
								      :value="item.marketCode">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
                    </el-row>
                    <el-row>
                    	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="经营户名称" prop="name">
                                <inputItem :value.sync="form.name"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="手机号码" prop="tel">
                                <inputItem :value.sync="form.tel"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="经营户类型">
                                <selectInput :value.sync="form.type" :disabled="true">
                                    <el-option
                                            v-for="item in dataDic.customerType"
                                            :key="item.key"
                                            :label="item.value"
                                            :value="item.key">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="经营户性质" prop="property">
                                <selectInput :value.sync="form.property">
                                    <el-option
                                            v-for="item in dataDic.customerProperty"
                                            :key="item.key"
                                            :label="item.value"
                                            :value="item.key">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="证件号" prop="regId">
                                <inputItem :value.sync="form.regId"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="法人代表">
                                <inputItem :value.sync="form.legalpepresent"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="是否分拣">
                                <selectInput :value.sync="form.isSorter">
                                    <el-option
                                            v-for="item in dataDic.whether"
                                            :key="item.value"
                                            :label="item.value"
                                            :value="item.key">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="是否配送">
                                <selectInput :value.sync="form.isDistribution">
                                    <el-option
                                            v-for="item in dataDic.whether"
                                            :key="item.value"
                                            :label="item.value"
                                            :value="item.key">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="微信openId" prop="wxopenid">
                                <inputItem :value.sync="form.wxopenid"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="助记码">
                                <inputItem :value.sync="form.mnemonic"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="自由选择供应商">
                                <selectInput :value.sync="form.isChoiceSupplier" :disabled="true">
                                    <el-option
                                            v-for="item in dataDic.whether"
                                            :key="item.value"
                                            :label="item.value"
                                            :value="item.key">
                                    </el-option>
                                </selectInput>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="备案时间">
                                <div class="block">
                                    <el-date-picker :readonly='true' :disabled="true" v-model="form.recordDate"
                                                    type="date"
                                                    valueFormat="yyyy-MM-dd" placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="地址" class="row-block">
                                <inputItem :value.sync="form.address" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="备注" class="row-block">
                                <inputItem :value.sync="form.remark" type="textarea"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="this.customerModalType === 'edit'">
                            <el-form-item label="经营户编码">
                                <inputItem :value.sync="form.code" :disabled="true"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="sysId == 0">
                            <el-form-item label="有效期天数">
                                <inputItem :value.sync="form.validDay"></inputItem>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="dialog-footer flex-x-end">
                    <elBtn @click="submit" text="提交" type="primary">提交</elBtn>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import local from '../local.js'
    import configs from '../configs.js'
    import mixin from '../mixin/mixin.js'

    export default {
        mixins: [mixin],
        components: {},
        data() {
            var checkTelephone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('手机号码必填'));
                } else {
                    this._ajax({
                        url: this.rootAPI + "customer/checkExistByLoginName",
                        param: {loginName: this.form.tel, id: this.form.id}
                    })
                        .then((function (d) {
                            if (d.state == 0) {
                                callback();
                            } else {
                                callback(new Error('手机号码已被注册,请重新输入!'));
                            }
                        }).bind(this))
                }
            };
            return {
                showForm: false,
                form: {
                    id: '',
                    channelCode: '',
                    name: '',
                    regId: '',
                    legalpepresent: '',
                    type: '',
                    property: '',
                    recordDate: '',
                    tel: '',
                    address: '',
                    remark: '',
                    wxopenid: '',
                    mnemonic: '',
                    isChoiceSupplier: 0,
                    isSorter: 0,
                    isDistribution: 0,
                    selectTab: '',
                    validDay: '',
                },
                dataDic: {
                    userStatus: [],
                    customerProperty: [],
                    customerType: []
                },
                channelList: [],
                dataList: [],
                rules: {
                    channelCode: [{required: true, message: '渠道必选'}],
                    name: [{required: true, message: '经营户名称必填'}, this._ruleLength(50)],
                    regId: [{required: true, message: '证件号必填'}, this._ruleLength(50)],
                    type: [{required: true, message: '经营户类型必填'}],
                    property: [{required: true, message: '经营户性质必填'}],
                    legalpepresent: [this._ruleLength(20)],
                    tel: [{required: true, validator: checkTelephone, trigger: 'blur'}, this._ruleMobile()],
                    mnemonic: [this._ruleLength(10)],
                    address: [this._ruleLength(200)],
                    remark: [this._ruleLength(100)],
                    validDay: [this._ruleLength(10)],
                    wxopenid: [this._ruleLength(100)],
                },
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            	this._ajax({ url: this.rootAPI, name: 'channel/list', param: {} })
                .then((function(d){
                	Object.assign(this.channelList, d.aaData)
                }).bind(this))
                this.showForm = false;
                Promise.all([this._searchDic('USER_STATE'),
                    this._searchDic('CUSTOMER_TYPE'),
                    this._searchDic('WHETHER'),
                    this._searchDic('CUSTOMER_PROPERTY')]
                ).then(function (results) {
                    this.showForm = true;

                    /*this._searchDic('USER_STATE')数据处理*/
                    let data1 = results[0].aaData;
                    $.each(data1, function (i, obj) {
                        obj.key = Number(obj.key);
                    });
                    Object.assign(this.dataDic, {
                        userStatus: data1
                    })
                    /*this._searchDic('CUSTOMER_TYPE')数据处理*/
                    let data2 = results[1].aaData;
                    $.each(data2, function (i, obj) {
                        obj.key = Number(obj.key);
                    });
                    Object.assign(this.dataDic, {
                        customerType: data2
                    })
                    /*this._searchDic('WHETHER')数据处理*/
                    let data3 = results[2].aaData;
                    $.each(data3, function (i, obj) {
                        obj.key = Number(obj.key);
                    });
                    Object.assign(this.dataDic, {
                        whether: data3
                    })
                    /*this._searchDic('CUSTOMER_PROPERTY')数据处理*/
                    let data4 = results[3].aaData;
                    Object.assign(this.dataDic, {
                        customerProperty: data4
                    })
                    
//                  let data5 = results[4].aaData;
//                  Object.assign(this.channelList, data5)

                    /*准备数据完成，开始请求数据*/
                    this._ajax({
                        url: this.rootAPI,
                        name: 'customer/queryById',
                        param: {id: local.get('sessionUser').typeCode}
                    }).then((function (d) {
                    	let result = d.aaData;
                    	this._ajax({
							url: this.rootAPI + 'market/list',
							param: {
								channelCode : result.channelCode,
							},
							arr: true
						}).then((function(d1) {
							let data = d1.aaData;
							this.marketList = data;
							this.form = d.aaData;
						}).bind(this))
                    }).bind(this));
                }.bind(this))
            },
            submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'customer/update';
                        let id = this.form.id;
                        let sorterTemp = '';
                        let distributionTemp = '';
                        if (this.oldSorter != this.form.isSorter) {
                            sorterTemp = this.form.isSorter
                        }
                        if (this.oldDistribution != this.form.isDistribution) {
                            distributionTemp = this.form.isDistribution
                        }
                        let user = local.get('sessionUser');
                        o = {
//                            channelCode : this.form.channelCode,
                            name: this.form.name,
                            regId: this.form.regId,
                            legalpepresent: this.form.legalpepresent,
//                            type : this.form.type,
                            property: this.form.property,
//							recordDate : this.form.recordDate,
                            tel: this.form.tel,
                            address: this.form.address,
                            remark: this.form.remark,
                            wxopenid: this.form.wxopenid,
                            mnemonic: this.form.mnemonic,
                            validDay: this.form.validDay,
                            operator: user.nickName,
                            isSorter: sorterTemp,
                            isDistribution: distributionTemp,
                            id: id
                        };
//                      console.info(o)
                        this._ajax({url: this.rootAPI + method, param: o})
                            .then((function (d) {
                                if (d.state == 0) {
                                    this.$message({type: 'success', message: '操作成功'});
                                    this.init();
                                } else {
                                    this.$message({type: 'failure', message: '操作失败:' + d.msg});
                                }
                            }).bind(this))
                    }
                })
            },
        }
    }
</script>

<style lang="sass">
    .jibenxinxi {
        padding: 20px;
    }
</style>
