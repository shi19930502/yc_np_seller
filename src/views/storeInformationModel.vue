<template>
	<div class="jianpuxinxi">
		<el-tabs v-model="activeName">
			<!--店铺信息-->
			<el-tab-pane label="店铺信息">
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
	                        <el-form-item label="店铺名称" prop="storeName" class="gerenxinX2">
	                            <inputItem :autosize="true" :value.sync="form.storeName" :maxlength="20" @blur="storeNameCilek" class="gerenxinXi"></inputItem></br>
	                            <span :style="{float:textLeft, color:msgColor}">{{msg}}</span>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="描述" prop="storeSuggest">
	                            <inputItem :autosize="true" type="textarea" :value.sync="form.storeSuggest" :maxlength="150" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	               <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="是否当天配送" prop="checked">
	                              <el-checkbox :autosize="true" v-model="checked" @change="changeCheckBox" class="gerenxinXi"></el-checkbox>
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="配送周期" prop="period">
	                            <inputItem :autosize="true" :value.sync="form.period" :maxlength="2" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>  
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="配送开始时间" prop="distributionStart">
	                        	 <el-time-select v-model="form.distributionStart" 
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '01:00',
								    step: '00:60',
								    end: '24:00'
									}" 
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionStart" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>
	                       
	                    </el-col>
	                </el-row> 
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="配送结束时间" prop="distributionEnd">
	                        	 <el-time-select v-model="form.distributionEnd" 
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '01:00',
								    step: '00:60',
								    end: '24:00'
									}" 
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionEnd" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                
	             	<el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="是否营业" prop="enabled">
	                              <el-checkbox :autosize="true" v-model="enabled" @change="changeEnabledBox" class="gerenxinXi"></el-checkbox>
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                <el-row v-if="enabled ==1">
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="开始营业时间" prop="openStart">
	                        	 <el-time-select v-model="form.openStart" 
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '01:00',
								    step: '00:60',
								    end: '24:00'
									}" 
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionStart" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>
	                       
	                    </el-col>
	                </el-row> 
	                <el-row v-if="enabled ==1">
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="结束营业时间" prop="openEnd">
	                        	 <el-time-select v-model="form.openEnd" 
	                        	 	:clearable="false"
	                        	 	:picker-options="{
								    start: '01:00',
								    step: '00:60',
								    end: '24:00'
									}" 
									placeholder="请选择时间"
									class="gerenxinXi">
								</el-time-select>
	                        	<!--<inputItem :autosize="true" :value.sync="form.distributionEnd" maxlength="2" class="gerenxinXi"></inputItem>-->
	                        </el-form-item>
	                    </el-col>
	                </el-row> 
	                 
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"> 
	                        <el-form-item label="联系电话" prop="phoneNumber">
	                            <inputItem :autosize="true" :value.sync="form.phoneNumber"  maxlength="11" class="gerenxinXi"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="店铺头像" prop="headPicUrl">
							    <uploadItem class="gerenxinX3" buttonType="icon"  @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" accept='.jpg,.png'></uploadItem>
		                    </el-form-item>
	                    </el-col>
	                </el-row>
	            </el-form>
	            <div class="submitB">
			        <elBtn @click="Submit" type="primary" :disabled="none">提交</elBtn>
			    </div>
			</el-tab-pane>
		</el-tabs>
   </div>
</template>

<script>
	var quotationIdTemp = '';
	import local from '../local.js'
	var k = "123"
	var j = 123
	var a = {
		aa:123
	}
	import configs from '../configs.js'
	import mixin from '../mixin/mixin.js'

	export default {
		mixins: [mixin],
		components: {},
		data() {
		    //配送周期
		     var Peisongtime = (rule, value, callback) => {
		        if(!(/^([1-9]|1\d|3[0-1])$/).test(this.form.period)){ 
					callback(new Error('配送周期为1-19天,请输入正确的配送周期！！'));
		        }
		        callback();
		     };
		     //配送时间
		     var TimeNumber = (rule, value, callback) => {
		        if(parseInt(this.form.distributionStart) >= parseInt(this.form.distributionEnd)){
		        	callback(new Error('配送开始时间不能小于结束时间！'));
		        }
		        callback();
		     };
		     var OpenRule = (rule, value, callback) => {
		        if(parseInt(this.form.openStart) >= parseInt(this.form.openEnd)){
		        	callback(new Error('营业开始时间不能小于营业结束时间！'));
		        }
		        callback();
		     };
			return {
				distributionStart: new Date(2018, 9, 10, 18, 40),
				distributionEnd: new Date(2018, 9, 10, 18, 40),
				form:{
					id: '',
                    storeName:'',
                    regId:'',
                    storeSuggest:'',
                    phoneNumber:'',
                    distributionStart:'',
                    distributionEnd:'',
                    period:1,
                    distributionToday:'',
                    enabled:'',
                    openStart:'',
                    openEnd:''
                },
				rules: {
					storeSuggest: [{message: '描述字段在150字以内！！', trigger: 'blur'}, this._ruleLength(150)],
					phoneNumber: [{required: true, trigger: 'blur'}, this._ruleMobile()],
					period: [{required: true, validator: Peisongtime, trigger: 'blur'}],
					distributionStart: [{required: true, validator: TimeNumber, trigger: 'blur'}],
					openStart: [{required: true, validator: OpenRule, trigger: 'blur'}],
					openEnd: [{required: true, validator: OpenRule, trigger: 'blur'}],
				},
                dataDic:{isEnabled : '', Id:''},
				dataList: [],
				rowOBJ: {},
				uploadfile:{
                	id:'',
                	filePath:'',
					fileSize:'',
					fileName:'',
					fileType:''
                },
                uploadList:[],
                headPicUrl:'',
                uploadData: {
                    savePath: 'storeinformation'
                },
				checked:false,
				enabled:false,
				msg:'',
				none:false,
				yingCangAnjiu:'none',
				zhuCiYingcang:'none',
				msgColor:'#f56c6c',
				textLeft:'left',
				count:'',
			}
		},
		mounted() {
			this.getInitData();
			
		},
		methods: {
			changeCheckBox(value){
				if(value){
					this.form.distributionToday = 1;
				}else{
					this.form.distributionToday = 0;
				}
//				console.log(this.form.distributionToday);
			},
			changeEnabledBox(value) {
				if(value){
					this.form.enabled = 1;
				}else{
					this.form.enabled = 0;
				}
			},
			getInitData() {
				//店铺列表
				let user = local.get('sessionUser');
				this._ajax({url: this.rootAPI, name: 'store/queryBySellerId', param: {
					sellerId:user.typeCode,
				}}).then((function(d) {
	            	Object.assign(this.form,d.aaData);
	            	if(d.aaData.distributionStart.toString().length == 1) {
	            		this.form.distributionStart ='0' + d.aaData.distributionStart + ':00'
	            	}else {
	            		this.form.distributionStart = d.aaData.distributionStart + ':00'
	            	}
	            	if(d.aaData.distributionEnd.toString().length == 1) {
	            		this.form.distributionEnd ='0' + d.aaData.distributionEnd + ':00'
	            	}else {
	            		this.form.distributionEnd = d.aaData.distributionEnd + ':00'
	            	}
	            	if(d.aaData.openStart.toString().length == 1) {
	            		this.form.openStart ='0' + d.aaData.openStart + ':00'
	            	}else {
	            		this.form.openStart = d.aaData.openStart + ':00'
	            	}
	            	if(d.aaData.openEnd.toString().length == 1) {
	            		this.form.openEnd ='0' + d.aaData.openEnd + ':00'
	            	}else {
	            		this.form.openEnd = d.aaData.openEnd + ':00'
	            	}
	            	//初始化checkbox
	            	this.checked = this.form.distributionToday == 1;
	            	this.enabled = this.form.enabled == 1;
	            	let storeTP=d.aaData
	            	if(storeTP.headPicUrl) {
						this.uploadfile = {
		            		id:storeTP.id,
		            		filePath : storeTP.headPicUrl,
		        		}
						this.uploadList=[];
						this.uploadList.push({"name" : "头像", "url" : configs.imgURL + storeTP.headPicUrl});
					}
	            }).bind(this))
			},
			searchTable() {
				this._ajax({
				 	url: this.rootAPI, 
				 	name: "store/queryBySellerId", 
				 	param: param, loading: 'dataLoading'}).then(this.form)
		     },
		     //确定店铺名称唯一
			storeNameCilek(){
				var wm = this;
				//查询渠道数据
				if(wm.form.storeName=="") {
					wm.count = 1;
					wm.msg ="店铺名称不能为空";
					wm.xainShiColor = '#f56c6c';
					wm.none =true;
					return;
				}
				this._ajax({
					url: this.rootAPI, 
					name: "store/queryByIsStoreNameEquals", 
					param: {
						id:wm.form.id,
						storeName:wm.form.storeName,
					}, loading: 'dataLoading'}).then((function(d) {
                        wm.count=d.aaData.count;
						if(wm.count==0 ){
							wm.none =false;
							wm.msg ="";
						}else{
							wm.none =true;
							wm.msgColor = '#f56c6c';
							if(wm.form.storeName) {
								wm.count = 1;
								wm.msg ="输入的店铺名称已存在，为方便管理请重新取名！！";
								return;
							}
						}
                     }).bind(this))
			},
			Submit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "store/create";
                        let id = this.form.id;
                        if(id) {
                            method = "store/update";
                        }
                        o= {
                        	storeName: this.form.storeName,
					        storeSuggest: this.form.storeSuggest,
		                    phoneNumber: this.form.phoneNumber,
						    remark: this.form.remark,
						    period: this.form.period,
						    distributionToday: this.form.distributionToday,
						    distributionStart: parseInt(this.form.distributionStart) ,
							distributionEnd: parseInt(this.form.distributionEnd),
							headPicUrl: this.uploadfile.filePath,
							enabled:this.form.enabled,
							id : id,
							openStart:parseInt(this.form.openStart),
							openEnd:parseInt(this.form.openEnd)
	                    }
                        let user = local.get('sessionUser');
                        if(!id) {
              
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		this.form.id = d.aaData.id;
                        		this.$message({ type: 'success', message: '操作成功' });
                        	} else {
                        		this.$message({ type: 'failure', message: d.msg}); 
                        	}
                        	this.getInitData();
                        	this.renderStoreInfo();
                            this.$emit('submit')
                           
                        }).bind(this))
                    }
                })
			},
		 	 uploadSuccess(response, file, fileList) {
            	if(response.state == 0) {
            		this.uploadfile.id = '';
            		this.uploadfile.filePath = response.aaData.path;
	            	this.uploadfile.fileSize = response.aaData.size;
	            	this.uploadfile.fileName = file.name;
	            	let fileTypeTemp = file.name.split('.');
	            	this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
	            	this.uploadList=[];
	            	this.uploadList.push({"name":"头像", "url":configs.imgURL + this.uploadfile.filePath});
	            	
            	}
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    filePath: ''
                })
                this.uploadfile.filePath = ''
            }
		}
	}
</script>
<style lang="sass">
	.jianpuxinxi{
		padding: 20px;
		text-align: center;
		.gerenxinX2{
			width:100%;
		}
		.gerenxinXi{
		  width:600px;
		  text-align: left;
	    }
		.gerenxinX3{
		  width:600px;
		  text-align: left;
		  float: left;
		  border:1px solid #FDFDFD;
		  padding:10px;
		  border-radius:5px;
	    }
	}
</style>