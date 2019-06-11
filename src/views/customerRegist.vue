<template>
	<div class="custormerRegist">
		<div class="headBOX">
			<span>
				<img src="../../lib/img/home_ing_logo.png"/>
				<font></font>
				<font>用户注册</font>
			</span>
			<span class="woyaodengl" @click="denvglu()">
				<font>我要登录</font>    
			</span>
		</div>
		<el-steps :active="active" finish-status="success" style="padding: 0px 120px 100px 120px;margin-top:140px ;">
			<el-step id="tiaozhuan1" title="验证手机号"></el-step>
			<el-step id="tiaozhuan2" title="填写账号信息"></el-step>
			<el-step id="tiaozhuan3" title="注册成功"></el-step>
		</el-steps>
		<el-form ref="smsValidForm" :model="smsValidForm" :rules="smsValidRules" label-width="160px" class="cusRegistform" v-if="active==1">
			<div class="shezhiYh">
				<el-form-item  prop="telephone">
					<p class="" style=" text-align: left;">手机号</p>
					<inputItem :value.sync="smsValidForm.telephone" placeHolder="请输入常用手机号" :maxlength="11" :readonly="counting"></inputItem>
				</el-form-item>
				<el-form-item  prop="smsCode">
					<p class="" style="text-align: left;">验证码</p>
					<inputItem :value.sync="smsValidForm.smsCode" placeHolder="请输入验证码" maxlength="16" :append="true">
						<elBtn slot="append" v-if="!counting" @click="sendSms">获取短信验证码</elBtn>
						<span slot="append" v-if="counting">验证码发送中({{coutingSec}})</span>
					</inputItem>
				</el-form-item>
				<p class="dashdv">
					<el-button type="primary" @click="submit_1">下一步</el-button>
				</p>
			</div>
		</el-form>
		<el-form ref="proForm" :model="proForm" :rules="proRules" label-width="120px" class="cusRegistform" v-if="active==2">
			<div class="shezhiYh">
				<el-form-item prop="name">
					<p class="" style=" text-align: left;">昵称</p>
					<inputItem :value.sync="proForm.name" placeHolder="请输入昵称" :maxlength="30"></inputItem>
				</el-form-item>
				<el-form-item prop="password">
					<p class="" style=" text-align: left;">密码</p>
					<inputItem :value.sync="proForm.password" placeHolder="请输入密码" :maxlength="16" type="password"></inputItem>
				</el-form-item>
				<el-form-item prop="passwordNew">
					<p class="" style=" text-align: left;">确认密码</p>
					<inputItem :value.sync="proForm.passwordNew" placeHolder="请输入确认密码" :maxlength="16" type="password"></inputItem>
				</el-form-item>
				<el-form-item prop="invitationCode">
					<p class="" style=" text-align: left;">邀请码</p>
					<inputItem :value.sync="proForm.invitationCode" placeHolder="请输入邀请码" :maxlength="30"></inputItem>
				</el-form-item>
				<p class="dashdv">
					<el-button type="primary" @click="goStep(1)">返回上一步</el-button>
					<el-button type="primary" @click="submit_2()">下一步</el-button>
				</p>
			</div>
		</el-form>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="cusRegistform" v-if="active==3">
			<div class="shezhiYh">
				<div id="zhuceCG">
					<img src="../../lib/img/zhucezhuant.png"/>
					<div>恭喜你注册成功，系统将于
						<font color="blue"><span id="num" size="2" face="impact">{{sec}}</span></font>秒后跳转至登录页面</div>
					<div class="dashdv">
						<el-button type="primary" @click="signLogin()">立即登录</el-button>
						<el-button type="primary" @click="signChongxin()">重新注册</el-button>
					</div>
				</div>
			</div>
		</el-form>

	</div>
</template>
<script>
	import local from '../local.js'
	import configs from '../configs.js'
	import mixin from '../mixin/mixin.js'
	var countDownLogin = null, countDown = null
	export default {
		mixins: [mixin],
		data() {
			var vm = this
			var validatePass = (rule, value, callback) => {
				if(value === '' || value.length<6) {
					callback(new Error('请输入密码，最低6位数'));
				} else {
					if(this.form.passwordNew !== '') {
						this.$refs.form.validateField('passwordNew');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.form.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var ruleCfmPassword = function(rule, value, callback) {
                if(value !== vm.proForm.password) {
                    callback(new Error('密码输入不一致'))
                }else {
                    callback();
                }
            }
			return {
				smsValidForm: {
					telephone: '',
					smsCode: ''
				},
				smsValidRules: {
					telephone: [this._ruleRequired({name: '手机号'}), this._ruleMobile(), this._ruleLoginName()],
					smsCode: [this._ruleRequired({name: '验证码'})]
				},
				proForm: {
					name: '',
					password: '',
					passwordNew: '',
					invitationCode: ''
				},
				proRules: {
					name: [this._ruleRequired({name: '昵称'}), this._ruleLength(20)],
					password: [this._ruleRequired({name: '密码'}), this._rulePassword()],
					passwordNew: [this._ruleRequired({name: '密码'}), { validator: ruleCfmPassword, trigger: 'blur' }],
					invitationCode: [this._ruleRequired({name: '邀请码'})]
				},
				dispalyUser: true,
				dispalyPro: false,
				dispalyPlease: false,
				dispalyQudao: false,
				dispalyRegistOK: false,
				msgColor: '#f56c6c',
				xainShiColor:'#f56c6c',
				textLeft: 'left',
				ISblur:'1px solid #409EFF',
				form: {
					name: '',
					telephone: '',
					channelCode: '',
					invitationCode: '',
					password: '',
					passwordNew: '',
				},
				checkList: ['merchant', ],
				active: 1,
				radio: '',
				sec: 6, //倒计时
				state: 1,
				xainShi:'',
				msg: '',
				msgs: '',
				key: '',
				none: true,
				yingCangAnjiu: 'none',
				zhuCiYingcang: 'none',
				channelList: [],
				telephoneList: [],
				flag: true,
				rules: {
					telephone: [{required: true, trigger: 'blur', message: '请输入手机号'}, this._ruleMobile()],
					password: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}, this._ruleLength(16)],
					passwordNew: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}, this._ruleLength(16)],
					radio: [{
						required: true,
						message: '请选择身份',
						trigger: 'change'
					}],
					channelCode: [{
						required: true,
						message: '请选择渠道',
						trigger: 'change'
					}],
				},
				logoPic: '',
				logoTxt: '',
				counting: false,
				coutingSec: 60,
				codeId: '',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var wm = this;
				//查询渠道数据
				$.ajax({
					type: "POST",
					url: this.rootAPI + 'channel/list',
					data: {
						level: 1
					},
					success: function(d) {
						wm.channelList = d.aaData
					}
				})
			},
			signLogin() {
				this.flag = false;
				this.$router.push({
					path: '/login'
				});
			},
			signChongxin() {
				this.flag = false;
				// window.location.reload()
				this.goStep(1)
				let obj1 =  {
					telephone: '',
					smsCode: ''
				}
				this.smsValidForm = obj1
				let obj2 = {
					name: '',
					password: '',
					passwordNew: '',
					invitationCode: ''
				}
				this.proForm = obj2
			},
			denvglu() {
				this.flag = false;
				this.signLogin();
			},
			resetForm(form) {
				this.$refs[form].resetFields();
			},
			sendSms() {
				this.$refs['smsValidForm'].validateField(['telephone'], (valid) => {
					if(!valid) {
						/*
							手机号格式验证通过，获取短信验证模板
						 */
						this._ajax({name: 'smstemplate/list', param: {smsType: 2}, valiToken: false})
							.then((function(d) {
								if(d.aaData.length > 0) {
									var temp = d.aaData[0].comment
									this._ajax({url: ROOT_API + '/reg/auth/smscode', param: {
										phone: this.smsValidForm.telephone,
										temp: temp
									}, valiToken: false})
									.then((function(d) {
										if(d && d.state === 0) {
											/*
												短信发送成功，开始倒计时
											 */
											this.counting = true
											this.codeId = d.aaData.codeId
											this.countDown()
										}else {
											this.$message({ type: 'error', message: '短信发送失败' });
										}
									}).bind(this))						
								}
							}).bind(this))
					}
				})				
			},
			countDown() {				
				if(this.coutingSec > 0) {
					this.coutingSec = this.coutingSec - 1
					countDown = setTimeout(this.countDown, 1000)
				}else {
					this.coutingSec = 60
					this.counting = false
					this.codeId = ''
				}				
			},
			submit_1() {				
				this.$refs['smsValidForm'].validate((valid) => {
					this._ajax({url: ROOT_API + '/reg/auth/smscodecheck', param: {
						smsCode: this.smsValidForm.smsCode,
						codeId: this.codeId
					}, valiToken: false})
						.then((function(d, textStatus, request) {
							if(d.state === 0) {
								this.active = 2
								this.dispalyUser = false
								this.dispalyPro = true
								clearTimeout(countDown)
								this.coutingSec = 60
								this.counting = false
								this.$refs['smsValidForm'].clearValidate()
							}else {
								this.$message({ type: 'error', message: '验证码输入有误' });
							}
						}).bind(this))							
				})				
			},
			submit_2() {				
				this.$refs['proForm'].validate((valid) => {
					if(valid) {
						this._ajax({name: 'customer/customerRegist', param: {
								name: this.proForm.name,
								telephone: this.smsValidForm.telephone,
								key: 'buyer',
								invitationCode: this.proForm.invitationCode,
								password: this.proForm.password,
							}, valiToken: false})
							.then((function(d) {
								if(d.state === 0) {
									this.active = 3
									this.dispalyPro = false
									this.dispalyRegistOK = true
									this.countDownLogin()
								}else {
									this.$message({ type: 'error', message: d.msg });
								}
							}).bind(this))
					}
				})
			},
			_ruleLoginName() {
				return {
					validator: (function(rule, value, callback) {
						this._ajax({name: 'customer/telephoneMatche', param: {telephone: $.trim(value)}, valiToken: false})
						.then(function(d) {
							if(d.state !== 1) {
								callback(new Error(d.msg))
							}else {
								callback();
							}
						})
					}.bind(this)), trigger: 'blur'
				}
			},
			goStep(num) {
				this.active = num
				if(num === 1) {					
					this.dispalyPro = false
					this.dispalyRegistOK = false
					this.dispalyUser = true
					// this.$refs['proForm'].resetFields()
					// this.$refs['smsValidForm'].resetFields()
				}
			},
			countDownLogin() {
				if(this.flag) {
					if(this.sec > 1) {
						this.sec = this.sec - 1
						countDownLogin = setTimeout(this.countDownLogin, 1000)
					}else {
						this.signLogin();
					}		
				}
			},
		},
		beforeDestroy() {
	        clearTimeout(countDownLogin)
	    }
	}
</script>

<style lang="sass">
	.custormerRegist {
		margin: 0;
		padding: 0;
		.el-step{
			 flex-basis: 20%;
		}
		.el-step__head.is-process{
			color: #fff;
		    border-color: #1E88E5;
		    background-color: #1E88E5;
		}
		.el-step__title.is-process{
		    color: #1E88E5;
			width: 120px;
			position: absolute;
			bottom: 0px;
			left:-10px;
		}
		.el-step__title.is-wait{
			color:#c0c4cc;
			width: 120px;
			position: absolute;
			bottom:0px;
			left:-10px;
		}
		.el-step__title.is-success{
			width: 120px;
			position: absolute;
			bottom: 0px;
			left:-10px;
		}
		.el-step__icon.is-text{
		    position: absolute;
			bottom:8px;
			left:-40px;
			background: inherit;
		}
		.el-step__line{
			/*top:0;*/
			/*background-color:inherit;*/
		} 
		.el-form-item--mini{
			height: 70px;
		}
		.el-form-item__content{
			display: initial;
		}
		.el-form-item__error{
			top:28px;width: 100%;text-align: left;	
		}
		.el-input .el-input__inner {
    		height: 35px;line-height: 35px;font-size: 16px;
    	}
    	.el-form-item__label{
    		height: 40px;line-height: 40px;font-size: 16px;
    	}
    	.el-input-group__append{
    		padding: 0;
    		width: 120px;
    		button:focus{
    			outline: 1px dotted;
    		}
    		.el-button{
    			height: 40px;
    			width: 120px;
    			&:focus{
    				border: none;
    			}
    		}
    	}

		height: 100%;
		background-color: #FFFFFF;
		margin: 0 auto;
		.headBOX {
			width: 100%;
			height: 60px;
			background-color: #1e88e5;
			box-shadow: 0px 1px 5px #343A40;
			span {
				margin-left: 10px;
				padding: 0;
				font {
					line-height: 60px;
					font-size: 24px;
					color: #FFFFFF;
					margin-left: 10px;
					font-family: "微软雅黑";
				}
				img {
					padding-bottom: 10px;
					margin: 0;
				}
			}
			.woyaodengl {
				float: right;
				font {
					line-height: 60px;
					font-size: 24px;
					color: #FFFFFF;
					margin-right: 20px;
					font-family: "微软雅黑";
				}
			}
		}
		.cusRegistform {
			width: 100%;
			height: auto;
			overflow: hidden;
			margin: 0 auto;
		}
		.shezhiYh {
			width: 620px;
			height: auto;
			text-align: center;
			margin: 0 auto;
			img {
				width: 100%;
			}

			.anjiuBut {
				width: 180px;
				height: auto;
				text-align: center;
				border: 1px solid #EFEFEF;
				border-radius: 5px;
				float: left;
				text-align: center;
				.el-radio__input{
					float: left;
				}
				.customerPHO{
					width: 80px;
					margin-top: 20px;
					margin-right: 20px;
				}
				.customerName{
					line-height:30px;
				}
			}
			.anjiuBut_GYS {
				width: 420px;
				height: auto;
				text-align: center;
				border: 1px solid #EFEFEF;
				border-radius: 5px;
				float: left;
				text-align: center;
				margin-left: 10px;
				.el-checkbox__input{
					float:left;
				}
				.customerPHO{
					width:60px;
				}
				.customerPHO1{
					width:80px;
				}
				.customerPHO2{
					width:50px;
				}
				.customerName{
					line-height:30px;
				}
			}
			.dashdv {
				line-height: 100px;
			}
			.GyingsjBox1 {
				width: 240px;
				float: left;
				margin-left: 18px;
				border: 1px solid #EFEFEF;
			}
			.GyingsjBox {
				width: 120px;
				float: left;
				margin-left: 18px;
				border: 1px solid #EFEFEF;
			}
			.Gyingsj {
				width: 90px;
				height: 70px;
			}
			.Gyingsj1 {
				width: 90px;
				height: 70px;
			}
			.Gyingsj2 {
				width: 80px;
				height: 70px;
			}
			.Msgs {
				color: red;
				font-size: 20px;
				line-height: 60px;
				position: absolute;
				top: 300px;
			}
		}
	}
</style>