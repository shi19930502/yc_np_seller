<template>
	<div class="page-login flex-y-center flex-x-center">
		<div class="center-box flex-y-center">
			<!--<div class="item left flex-y-center flex-x-center">
				<div style="text-align: center;">
					<img src="../../lib/img/loginImg/s_logo.png" height="133" width="265" v-if="city === '银川'">
					<img src="../../lib/img/loginImg/-s-logo.png" height="147" width="220" v-if="city === '临沂'">
					<img src="../../lib/img/loginImg/-s-logo (2).png" height="156" width="143" v-if="city === '农鲜汇'">
					<img src="../../lib/img/loginImg/logo-yuexi.png" height="152" width="315" v-if="city === '越西'">
					<div class="welcome" v-if="city === '农鲜汇'">欢迎来到农鲜汇卖家中心</div>
					<div class="welcome" v-if="city === '临沂'">欢迎来到临沂追溯卖家中心</div>
					<div class="welcome" v-if="city === '银川'">欢迎来到银川公益市场卖家中心</div>
					<div class="welcome" v-if="city === '越西'">欢迎来到越西电商卖家中心</div>
				</div>				
			</div>-->
			<div class="item right flex-y-center" v-loading="loading">
				<div style="width: 100%;">
					<el-form class="login-form" :model="form" ref="form" :rules="rules">
						<el-row justify="center" type="flex">
							<el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
								<el-form-item prop="username">
		                            <inputItem :value.sync="form.username" placeHolder="请输入用户名" :maxlength="30" @enter="login"></inputItem>
		                        </el-form-item>
							</el-col>						
						</el-row>
						<el-row justify="center" type="flex">
							<el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
								<el-form-item prop="password">
		                            <inputItem :value.sync="form.password" placeHolder="请输入密码" :maxlength="30" @enter="login" type="password"></inputItem>
		                        </el-form-item>
							</el-col>
						</el-row>
						<el-row justify="center" type="flex">
							<el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
								<el-form-item prop="verifiCode">
									<div class="flex-x-start">
										<inputItem :value.sync="form.verifiCode" placeHolder="请输入验证码" 
										:maxlength="6" @enter="login"
										:append="true">
				                        	<img style="height: 40px;" :src="verifyCodeSRC" @click="refreshVerifyCode" slot="append">
										</inputItem>			                            
									</div>		                            
		                        </el-form-item>
							</el-col>
						</el-row>									
					</el-form>
					<div class="login-box-bot">
						<div class="flex-x-center flex-y-center btn-login" @click="login">登  录</div>
					</div>
				</div>	
				<div class="right-bottom">
					<font color="#EBEBEB">没有账号？</font>
					<span class="a-reg" @click='register()' v-if="city !== '农鲜汇'"><font color="darkblue">免费注册</font></span>
					<span class="a-reg" @click='registerNew()' v-if="city === '农鲜汇'">快速注册</span> 
				</div>
			</div>
		</div>
		<div class="RidingLantern">
			<el-carousel indicator-position="outside">
				<div class="logo_imges_Y">
				    <img src="../../lib/img/loginImg/nav_logo@3x.png" />
				    <img src="../../lib/img/loginImg/slogin@3x.png"  class="slogin_login"/>
				</div>
			    <el-carousel-item v-for="item in 3" :key="item">
			    </el-carousel-item>
				<div class="login_dibian_L">
					<ul>
						<li>
							<h4 class="chuaping_ZT">配送高效</h4>
							<p>专业配送， 精准高效</p>
						</li>
						<li>
							<h4 class="chuaping_ZT">食品安全</h4>
							<p>严格监控， 层层把关</p>
						</li>
						<li>
							<h4 class="chuaping_ZT">可溯源</h4>
							<p>来源可追溯， 去向可查证</p>
						</li>
					</ul>
				</div>
			</el-carousel>
		</div>
		<div class="login_dibian_XWGG">
			<ul>
				<li>
					<h4>最新新闻</h4>
					<p style="height: 20px;"></p>
					<p v-for="(item, index) in platformnoticeList">
						<img src="../../lib/img/loginImg/img_new@2x.png" width="32"height="15" v-if=" index == 1 || index == 0"/>
						<span class="p_title_Box"> {{item.channelName}} </span>
						<span class="p_title_Box1"> {{item.title}} </span>
					</p>
				</li>
				<li>
					<h4>系统公告</h4>
					<p style="height: 20px;"></p>
					<p v-for="(item, index) in platformnoticeList">
						<img src="../../lib/img/loginImg/img_new@2x.png" width="32"height="15" v-if=" index == 1 || index == 0"/>
						<span class="p_title_Box"> {{item.channelName}} </span>
						<span class="p_title_Box1"> {{item.title}} </span>
					</p>
				</li>
			</ul>
		</div>
		<div class="login_dibian_BQ">
			<footer id='footer' style="line-height: 35px;">
				<span style="margin-top:10px;display: inline-block;">Copyright © 2019 成都九洲电子信息系统股份有限公司 蜀 ICP 编号09004242-1</span><br>
				<span>版本号：{{versionNumber}}</span>
			</footer>
		</div>	
	</div>
	
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import local from '../local.js'
	import configs from '../configs.js'
	export default {
		name: 'login',
		mixins: [mixin],
		data() {
			return {
				city: configs.city,
				versionNumber:'V0.0.0.1',
				winSize: {
					width: '',
					height: ''
				},
				verifyCodeSRC: ROOT_API + '/login/auth/code',
				form: {
					username: '',
					password: '',
					verifiCode: ''
				},
				rules: {
					username: [{
						required: true,
						message: '用户名不能为空！',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空！',
						trigger: 'blur'
					}],
				},
				loading: false,
				platformnoticeList:'',
//				channelName:'暂无消息',
			}
		},
		methods: {
			register() {
				this.$router.push({ path: '/customerRegist'});
			},
			registerNew() {
				this.$router.push({ path: '/registerNewtwo'});
			},
			logOut() {
				local.remove('userinfo')
	          	local.remove('token')
	          	local.remove('navlist')
	          	local.remove('sessionUser')
	          	local.remove('extend')
			},
			login() {
				var vm = this
				this.$refs['form'].validate((valid) => {
					if(valid) {
						vm.loading = true
						$.ajax({
							type: "POST",
							url: configs.loginAPI,
							dataType: 'jsonp',
			               	jsonp: "callback",
			               	jsonpCallback:"flightHandler",
							data: {
								loginName: vm.form.username,
								password: vm.form.password,
								systemId: configs.sysID,
								flag: 1,
								authCode: vm.form.verifiCode,
							},
							success: function(d) {
//								console.log(d)
								if(d.state === 0) {
									var userinfo = d.loginUser
//									console.log(d.loginUser.isValid)
									var token = d.token
									var navlist = d.menuItemLlist
									var sessionUser = d.sessionUser	
									local.set('userinfo', userinfo)
									local.set('token', token) 
									local.set('navlist', navlist)
									local.set('sessionUser', sessionUser)
									local.set('loginname', vm.form.username)
									// if(configs.city === '农鲜汇') {
									// 	if(!d.loginUser.isValid && d.loginUser.isValid != 1) {
									// 		vm.$alert('抱歉：该备案用户备案信息不完整，已超出安全登录日期，无法登录！！','错误提示', {
									//           	confirmButtonText: '去完善',
									//            	callback: action => {
									//           	 	vm.$router.push({name: 'complementingInformation', query:{userinfo}})
									//           	}
									//         });
									// 		vm.logOut();
									// 		return;
									// 	}
									// }
									if(!vm.isEmptyObject(d.loginUser)) {
										local.set('extend', d.loginUser.extend)
									}																		
									if(userinfo) {
										if(userinfo.loginName === 'admin') {
											vm.loading = false											
											vm.$router.push({ name: 'index' })
										}else {
											vm._ajax({url: vm.userAPI, name: 'user/list', param: {
												id: userinfo.userId,
												loginName: userinfo.loginName,
												sysId: configs.sysID
											}}).then(function(d) {
												vm.loading = false
												if(d.state === 0) {
													if(d.aaData.length > 0) {
														var customerId = parseInt(d.aaData[0].typeCode) || 0
														var extend = d.aaData[0].extend
														local.set('extend', 'main')		
														vm._ajax({name: 'customer/list', param: {id: customerId}})
														  .then(function(d) {
														  	if(d.state === 0 && d.aaData.length > 0) {
														  		if(d.aaData[0].enabled == 1) {
														  			var first = navlist[0], index = 'index'
														  			if(first.hasChildren == 0) {
														  				index = first.caption
														  			}
														  			if(first.hasChildren == 1 && Array.isArray(first.children)) {
														  				index = first.children[0].caption
														  			}
														  			if(sessionUser.typeId == 'buyer') {
//														  				vm.$router.push({ name: 'buyer_orderManage' })
																		vm.$message({ type: 'error', message: '采购商暂不能在卖家中心登录' });
														  				vm.logOut()
														  			}else {
														  				vm.$router.push({ name: index })
														  			}
														  		}else {
														  			vm.$message({ type: 'error', message: '该备案用户未激活,无法登录' });
														  			vm.logOut()
														  		}
														  	}else {
														  		vm.$message({ type: 'error', message: '该用户未备案,无法登录' });
														  		vm.logOut()
														  	}
														  })
													}else {
														vm.$message({ type: 'error', message: '用户不存在,无法登录' });
														vm.logOut()
													}												
												}else {
													vm.$message({ type: 'error', message: d.msg });
													vm.logOut()
												} 
											})
										}										
									}else {
										vm.loading = false
										vm.$message({ type: 'error', message: '用户不存在,无法登录' });
										vm.logOut()
									}									
								} else {
									vm.loading = false
									vm.$message({ type: 'error', message: d.msg });
									vm.refreshVerifyCode()
								}
							},
							error: function(req, error) {
		                    	vm.loading = false
		                    	vm.$message({type: 'error', message: error});
		                    }
						})
					}
				});
			},
			refreshVerifyCode() {
				this.verifyCodeSRC = this.verifyCodeSRC + '?s=' + new Date().getTime()
			}
		},
		mounted() {
//			公告新新闻
			var wm = this;
			$.ajax({
				type: "POST",
				url: this.rootAPI + 'platformnotice/queryListByUserTypeContainMerchant',
				data: {
					pageNum:0,
					pageSize:5
				},
				success: function(d) {
					let dataCount=d.dataCount
					wm.platformnoticeList = d.aaData
				}
			})
			
			var loginName = local.get('loginname')
			if(loginName != null) {
				Object.assign(this.form, {
					username: loginName
				})
			}
			var vm = this
			//版本号
			$.ajax({
					type: "POST",
					url: configs.rootAPI +'datadic/list',
					data:{
						key:'01',
						dataType:'SYSTEM_VERSION',
					},
					success: function(d) {
						vm.versionNumber = d.aaData[0].value
					}
				})

			this.refreshVerifyCode()
		},
	}
</script>
<style lang="sass">
	.page-login{
		min-height:auto;
		min-width: 360px;
	    -webkit-background-size: cover;
	    -moz-background-size: cover;
	    -o-background-size: cover;
	    background-size: cover;
	 /*以下为走马灯样式*/
	    .RidingLantern{
	    	width: 100%;
	    	z-index:0;
	    	/*height:60%;*/
	    	.el-carousel__container{
	    		height:620px;
	    	}
		  	.el-carousel__item:nth-child(2n) {
			  	background: url(../../lib/img/loginImg/baner_bg@2x.png); /*no-repeat center center fixed*/
			   	-webkit-background-size: cover;
			    -moz-background-size: cover;
			    -o-background-size: cover;
			    background-size: cover;
		  	}
		  	.el-carousel__item:nth-child(2n+1) {
		   		background: url(../../lib/img/loginImg/baner_bg@2x.png);/* no-repeat center center fixed*/
		    	-webkit-background-size: cover;
			    -moz-background-size: cover;
			    -o-background-size: cover;
			    background-size: cover;
		  	}
		  	.el-carousel__indicators--outside{
		  		position: absolute;
		  		top: 480px;
		  	}
	    }
	 /*登录块*/
	    .center-box{
	    	z-index:1000;
	    	position: absolute;
	    	right:0;
	    	margin-right:100px;
	    	box-shadow: #0300084a 0px 2px 5px 2px;/*边框阴影*/
	    	.item {
	    		width: 350px;height: 346px;
	    		&.left {
	    			background: #2F3D4A;
	    		}
	    		&.right {
	    			background: -webkit-linear-gradient(#6884e0, #9b29bb); /* Safari 5.1 - 6.0 */
				    background: -o-linear-gradient(#6884e0, #9b29bb); /* Opera 11.1 - 12.0 */
				    background: -moz-linear-gradient(#6884e0, #9b29bb); /* Firefox 3.6 - 15 */
				    background: linear-gradient(#7789e5, #9b29bb); /* 标准的语法（必须放在最后） */
				    opacity: 0.95;
	    			position: relative;
	    		}
	    		.welcome{
	    			color: #67BE30;
	    			font-size: 24px;
	    			text-align: center;
	    			margin-top: 20px;
	    		}
	    	}
	    }
	    .login-form{
	    	.el-input .el-input__inner {
	    		border: none;
	    		border-bottom: 1px solid #EBEBEB;
	    		padding: 0;
	    		height: 42px;
	    		line-height: 42px;
	    		padding-left: 15px;
	    	}
	    	.el-input-group__append{
	    		padding: 0;
	    		border: none;
	    		border-bottom: 1px solid #EBEBEB; 
	    		width:20%
	    	}
	    	
	    }
	    .login-box-bot{
			padding: 0 25px;
			.btn-login{
				height: 36px;
				background-color: #1E88E5;
				color: #fff;
				font-size: 18px;
				border-radius: 3px;
				cursor: pointer;
			}
		}
		.right-bottom{
			position: absolute;
			bottom: 0;
			height: 54px;
			line-height: 54px;
			width: 100%;
			text-align: center;
			font-size: 14px;
			.a-reg{
				cursor: pointer;
				&:hover{
					text-decoration:underline;
				}
			}
		}
		.logo_imges_Y{
			width: 100%;
			height:80px;
			/*border-bottom:1px solid #f8f9fa7d;*/
			box-shadow: #0300084a 0px 0.2px 2px 0.2px;/*边框阴影*/
			z-index: 888;
			position: absolute;
			background: -webkit-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Safari 5.1 - 6.0 */
		    background: -o-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Opera 11.1 - 12.0 */
		    background: -moz-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Firefox 3.6 - 15 */
		    background: linear-gradient(to top, rgba(0,0,0,0), rgba(52,58,64,0.7)); /* 标准的语法（必须放在最后） */
			top:0;
			img{
				width:246px;
				position: absolute;
				top:10px;
				left: 16%;
			}
			.slogin_login{
				width:400px;
				position: absolute;
				top:26px;
				left: 60%;
				
			}
		}
		.login_dibian_L{
			width: 100%;
			height:100px;
			/*border-top:1px solid #f8f9fa7d ;*/
			box-shadow: #0300084a 0px 0.2px 2px 0.2px;/*边框阴影*/
			z-index: 888;
			position: absolute;
			background: -webkit-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Safari 5.1 - 6.0 */
		    background: -o-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Opera 11.1 - 12.0 */
		    background: -moz-linear-gradient(top, rgba(0,0,0,0), rgba(96,98,102,0.9)); /* Firefox 3.6 - 15 */
		    background: linear-gradient(to top,rgba(52,58,64,0.7), rgba(0,0,0,0), ); /* 标准的语法（必须放在最后） */
			top:520px;
			text-align: center;	
			ul{
				display: inline-flex;		
				li{
					float: left;
					width:auto;
					height: 80px;
					text-align: left;
					margin-left:100px;
					.chuaping_ZT{
						color: #FFFFFF;
						font-size: 20px;
						font-family: "微软雅黑";
						margin-top: 20px;
					}
					p{
						color: #D0D0D0;
						font-size: 16px;
						font-family: "微软雅黑";
						line-height: 50px;
					}
				}
			}
		}
		.login_dibian_XWGG{
			width: 100%;
			height: auto;
			min-height: 300px;
			position: absolute;
			background-color:#FFFFFF;
			top:620px;
			text-align: center;	
			ul{
				display: inline-block;
				padding-bottom: 80px;
				li{
					float: left;
					width:400px;
					overflow: hidden;
					text-align: left;
					margin-left:120px;
					h4{
						width:100px;
						height:30px;
						margin-top: 26px;
						border-bottom: 2px solid #1E88E5;
					}
					p{
						width:400px;
						height: auto;
						color: #525252;
						font-size: 16px;
						font-family: "微软雅黑";
						overflow: hidden;
						white-space: nowrap;
						text-overflow:ellipsis;
						padding-top:10px;
						/*span{
							width:400px;
							display: inline-block;
						}*/
						.p_title_Box{
								width:auto;
								overflow: hidden;
								white-space: nowrap;
								text-overflow:ellipsis;
						}
						.p_title_Box1{
						    margin-left: 10px;
							width:auto;
						}
						
					}
				}
			}
		}
		.login_dibian_BQ{
			width: 100%;
			height:auto;
			background-color:#002752;
			position: fixed;
			bottom: 0;
			z-index: 999;
			p{
				color: #FFFFFF;
				font-size: 14px;
				text-align: center;
				line-height:45px;
			}
		}
	}

</style>