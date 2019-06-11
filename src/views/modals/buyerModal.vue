<template>
	<el-dialog custom-class="page-buyer" title="新增采购商" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
			<el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="登录名" prop="loginName">
	                    <inputItem :autosize="true" :value.sync="form.loginName" :maxlength="30"></inputItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="昵称" prop="name">
	                    <inputItem :autosize="true" :maxlength="30" :value.sync="form.name"></inputItem>
	                </el-form-item>
	            </el-col>
	        </el-row>
	        <el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <el-form-item label="手机号" prop="telephone">
	                    <inputItem :autosize="true" :maxlength="11" :value.sync="form.telephone"></inputItem>
	                </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                <!--<el-form-item label="邀请码" prop="invitationCode">
	                    <inputItem :autosize="true" :maxlength="11" :value.sync="form.invitationCode"></inputItem>
	                </el-form-item>-->
	                <el-form-item label="指定报价单" prop="invitationCode">
	                    <selectInput :value.sync="form.invitationCode">
							<el-option
						      v-for="item in quotationList"
						      :key="item.id"
						      :label="item.quotationTitle"
						      :value="item.inviteCode">
						    </el-option>
						</selectInput>
	                </el-form-item>
	            </el-col>
	        </el-row>
	    </el-form>
	    <div style="text-align: right">
	    	<elBtn @click="cancel" type="info">取消</elBtn>
	        <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check">提交</iconBtn>
	    </div>
   	</el-dialog>
</template>

<script>
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			var checkLoginName = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('登录名必填'));
		        } else {
		        	this._ajax({url: this.rootAPI + "customer/checkExistByLoginName", param: {loginName:this.form.loginName}})
                    .then((function(d) {
                    	if(d.state == 0) {
                    		callback();
                    	} else {
                    		callback(new Error('登录名已存在，请重新输入!'));
                    	}
                	}).bind(this))
		        }
		    };
		    var checkTelephone = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('手机号码必填'));
		        } else {
		        	this._ajax({url: this.rootAPI + "customer/telephoneMatche2", param: {telephone:this.form.telephone}})
                    .then((function(d) {
                    	if(d.state == 0) {
                    		callback();
                    	} else {
                    		callback(new Error('手机号已存在，请重新输入!'));
                    	}
                	}).bind(this))
		        }
		    };
		    var checkExistByNickName = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('昵称必填'));
		        } else {
		        	this._ajax({url: this.rootAPI + "customer/checkExistByNickName", param: {nikeName:this.form.name, id : this.form.id}})
                    .then((function(d) {
                    	if(d.state == 0) {
                    		callback();
                    	} else {
                    		callback(new Error('昵称已存在，请重新输入!'));
                    	}
                	}).bind(this))
		        }
		    };
			return {
				form: {
					name : '', 
					loginName : '', 
					telephone : '', 
					password : '', 
					key : '', 
					invitationCode:''
				},
				quotationList: [],
				rules: { 
                	loginName: [{required: true, validator: checkLoginName, trigger: 'blur'}, this._ruleLength(50)],
                	name: [{required: true, validator: checkExistByNickName}, this._ruleLength(16)],
                	telephone: [{required: true, validator: checkTelephone, trigger: 'blur'}, this._ruleMobile()],
                	invitationCode:[{required: true, message: '请指定报价单' }],
				},
			}
		},
		props: {
			modal: {
				default: false
			},
			ids: {
				default: function() {
					return {}
				},
			}

		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this._ajax({url: this.rootAPI, name: 'quotation/list', param: {}})
				.then((function(d) {
					this.quotationList = d.aaData
//					console.info(d);
				}).bind(this))
			},
			valideSubmit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "customer/customerRegist";
                        let user = local.get('sessionUser');
                        this._ajax({url: this.rootAPI + "customer/queryById", param: {id:user.typeCode}})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		o = {
									name : this.form.name,
									loginName : this.form.loginName,
									telephone : this.form.telephone, 
									invitationCode : this.form.invitationCode,
									password : '123456', 
									key : 'buyer', 
	                            }
		                        this._ajax({url: this.rootAPI + method, param: o})
		                        .then((function(d) {
		                        	if(d.state == 0) {
		                        		this.$message({ type: 'success', message: '操作成功' });
		                        		this.cancel()
		                        	} else {
		                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
		                        	}
		                        }).bind(this))
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
                        	}
                        }).bind(this))
                    }
                })
			},
			cancel() {
				this.$emit('close')
			},
			beforeClose(done) {
				this.cancel()
				done()
			}
		}
	}
</script>
<style lang="sass">
    .page-channel{
        .row-block{
        	width: 100%;
            .el-form-item__content {
                width: calc(100% - 150px);
                &>div{
                    width: 100%;
                }
            }            
        }
    }
</style>
