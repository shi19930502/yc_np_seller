<template>
	<div class="page-channel">
		<el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
			<el-tab-pane label="基础信息" name="first">
				<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="140px">
					<el-row>
						<el-col :md="24"> 
							<el-form-item label="商品所属分类" prop="categoryId" class="row-block">
									<cascaderItem style="width: 98%;" :options="categoryList" :value.sync="categoryIds" :propss="propss" @change="categoryChange" :changeOnSelect="false"></cascaderItem>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                        <el-form-item label="商品名称" prop="name">
	                            <inputItem :autosize="true" :value.sync="form.name"></inputItem>
	                        </el-form-item>
	                    </el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
								<el-form-item label="商品别名" prop="vulgo">
										<inputItem :autosize="true" :value.sync="form.vulgo"></inputItem>
								</el-form-item>
						</el-col>
					</el-row>
					<el-row>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                        <el-form-item label="基本单位" prop="measureMethod">
	                            <selectInput :value.sync="form.measureMethod" @selectChange="measureMethodChange">
									<el-option
											v-for="item in measuremethodList"
											:key="item.name"
											:label="item.name"
											:value="item.code">
									</el-option>
								</selectInput>
	                        </el-form-item>
	                    </el-col>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                        <el-form-item label="商品编码" prop="code">
	                            <inputItem :autosize="true" :value.sync="form.code"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                        <el-form-item label="商品价格（元）" prop="basePrice" v-if="isAdd">
	                            <inputItem :autosize="true" :value.sync="form.basePrice"></inputItem>
	                        </el-form-item>
	                   	</el-col>
	                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	                        <el-form-item label="所属店铺" prop="storeId">
	                            <selectInput :value.sync="form.storeId" style="width: 100%;">
									<el-option
								      v-for="item in storeList"
								      :key="item.id"
								      :label="item.storeName"
								      :value="item.id">
								    </el-option>
								</selectInput>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="商品主图" prop="productPicUrl" style="height: 100px;">
							    <uploadItem buttonType="icon" @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" accept='.jpg,.png'></uploadItem>
		                    </el-form-item>
	                   	</el-col>
	                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"> 
	                        <el-form-item label="描述" prop="remark" class="row-block">
	                            <inputItem  type="textarea" :value.sync="form.remark"></inputItem>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	            </el-form>
	            <div style="text-align: right">
			        <elBtn @click="cancel" type="info">取消</elBtn>
                    <iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check" >提交</iconBtn>
				</div>
			</el-tab-pane>
			<el-tab-pane label="商品规格" name="second" :disabled="tabDisabled">
				<!--<el-button size="small" @click="addTab(editableTabsValue)">添加规格</el-button>-->
				<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="skuHandleClick">
					<el-tab-pane
					    v-for="(item, index) in editableTabs"
					    :key="item.tagName"
					    :label="item.title"
					    :name="item.tagName">
					    
					    <productSkuModal :productSkuModalType="modalType" @close="modalClose" :productSku="item" @submit="modalSubmit"></productSkuModal>
					</el-tab-pane>
					<el-tab-pane label="[+添加规格]" name="addTab" ></el-tab-pane>
				</el-tabs>
			</el-tab-pane>
		</el-tabs>
   </div>
</template>

<script>
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	import productSkuModal from './productSkuModal.vue'
	export default {
		mixins: [mixin],
		components: {productSkuModal},
		data() {
			return {
				dateRange:[],
				form: {
					id : '',
					categoryId : '',
					code : '',
					name : '',
					vulgo : '',
					measureMethod : '',
					productPicUrl : '',
					remark : '',
					basePrice : '',
					storeId : '',
                },
                uploadfile:{
                	id:'',
                	filePath:'',
					fileSize:'',
					fileName:'',
					fileType:''
                },
                uploadData: {
                    savePath: 'productOnline'
                },
                categoryList:[],
                categoryIds: [],
                storeList:[],
                propss: {
                    label: 'name',
                    value: 'id',
                    children: 'childList',
                },
                uploadList: [],
                rules: {
                	categoryId: [{required: true, message: '商品分类必选' }],
                	storeId: [{required: true, message: '所属店铺必选' }],
                	basePrice: [{required: true, message: '商品价格必填' }, this._ruleTwoFloatPlus()],
                	name: [{required: true, message: '商品名称必填' }, this._ruleLength(50)],
                	measureMethod: [{required: true, message: '计量单位必选' }],
                	vulgo : [this._ruleLength(50)],
                	remark : [this._ruleLength(100)],
                },
				activeName: 'first',
				measuremethodList: [],
				tabDisabled : true,
				editableTabsValue: '0',
		        editableTabs: [],
		        tabIndex: 1,
		        measureType: '',
		        measureMethodName:'',
		        skuMeasuremethodList : '',
		        tabDataflag : true,
		        user : local.get('sessionUser'),
		        isAdd : true
			}
		},
		mounted() {
			this.getInitData();
			var paramsTemp = this.$route.query;
			let idTemp = paramsTemp.id;
			if(idTemp) {
				let paramTemp = {
					pageNum: 1, 
					pageSize: 1,
					id : idTemp
				};
				this._ajax({name: 'product/queryList', param: paramTemp})
				.then((function(d){
					let params = d.aaData[0];
					Object.assign(this.form, params);
					this.isAdd = false;
					this._ajax({url: this.rootAPI, name: 'category/getListIdBySelectId', param: {id : params.categoryId}})
					.then((function(d) {
	//					console.info(d)
						this.categoryIds = d.aaData;
		            }).bind(this));
					this.tabDisabled = false;
					if(params.productPicUrl) {
						this.uploadfile = {
		            		id:params.id,
		            		filePath : params.productPicUrl,
		        		};
						this.uploadList.push({"name" : "商品主图", "url" : configs.imgURL + params.productPicUrl});
					}
				}).bind(this))
			} else {
				//获取生成的商品编码
				this._ajax({url: this.rootAPI, name: 'product/getProductCode', param: {customerId : this.user.typeCode}})
				.then((function(d) {
					this.form.code = d.aaData
				}).bind(this))
			}
			//获取店铺数据
			this._ajax({url: this.rootAPI, name: 'store/list', param: {
				'sellerId' : this.user.typeCode,
//				'enabled' : 1,
			}})
			.then((function(d) {
				this.storeList = d.aaData;
				if(!idTemp)
					this.form.storeId = this.storeList[0].id
            }).bind(this));
		},
		methods: {
			getInitData() {
				//基础单位
				this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
				.then((function(d) {
					this.measuremethodList = d.aaData;
	            }).bind(this));
				//商品分类
				let categoryList = this.$store.state.categoryList;
				if(!categoryList || categoryList.length == 0) {
					this._saveProCategory()
					.then((function(d) {
						this.categoryList = this.$store.state.categoryList;
					}).bind(this))
				} else {
					this.categoryList = this.$store.state.categoryList;
				}
//				console.info(this.categoryList)
			},
			cancel() {
				this.$router.push({name : 'productOnline'});
			},
			valideSubmit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "product/create";
                        let id = this.form.id;
                        if(id) {
                            method = "product/update";
                        }
                        o = {
								id : id,
								categoryId : this.form.categoryId,
								code : this.form.code,
								name : this.form.name,
								vulgo : this.form.vulgo,
								basePrice : this.form.basePrice,
								storeId : this.form.storeId,
								measureMethod : this.form.measureMethod,
								measureTypePro : this.measureType,
								productPicUrl : this.uploadfile.filePath,
								remark : this.form.remark,
								published : this.form.published,
								deleted : 0,
								haveSku : 1,
                            };
//                          console.info(o);
                        if(!id) {
                        	o.published = 1;
                            o.createdPersonId = this.user.userId;
							o.createdPersonName = this.user.nickName;
							o.customerId = this.user.typeCode;
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		if(!id) {
                        			let vm = this;
	                        		this.$confirm('是否跳转回列表？', '确认信息', {
							          distinguishCancelAndClose: true,
							        })
	                        		.then(() => {
	                        			this.cancel();
							        })
							        .catch(action => {
							            vm.form.id = d.aaData.id;
							            vm.form.published = d.aaData.published;
                        				vm.isAdd = false;
                        				vm.tabDisabled = false;
		                        		vm.$message({ type: 'success', message: '操作成功' });
		                        		vm.refreashTab();
							        });
                        		} else {
                        			this.tabDisabled = false;
	                        		this.$message({ type: 'success', message: '操作成功' });
	                        		this.refreashTab();
                        		}
						        
//                      		this.confirm('是否跳转回列表？', '确认信息', {distinguishCancelAndClose: true,}, (function() {
//                  				this.$router.push({name : 'productOnline'});
//                  			}).bind(this))
//                      		this.tabDisabled = false;
//                      		this.$message({ type: 'success', message: '操作成功' });
//                      		this.refreashTab();
//                      		if(!id) {
//                      			this.form.id = d.aaData.id;
//                      			this.isAdd = false
//                      		}
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败:'+d.msg }); 
                        	}
                            this.$emit('submit')
                        }).bind(this))
                    }
                })
			},
			handleClick(tab, event) {
//		        console.log(tab, event);
				if(tab.name == 'second' && this.tabDataflag) {
					//查询商品已有规格
					this.refreashTab();
					this.tabDataflag = false
				}
		    },
		    skuHandleClick(tab, event) {
		    	if(tab.name == "addTab") {
		    		this.addTab();
		    	}
		    },
		    /*基本单位改变时触发*/
		    measureMethodChange(val) {
		    	let arr = this.measuremethodList;
		    	let measureType = '';
		    	let measureMethodName = '';
				$.each(arr, function(i, obj) {
					if(obj.code == val) {
						measureType = obj.methodType;
						measureMethodName = obj.name
					}
				});
				this.measureType = measureType;
				this.measureMethodName = measureMethodName;
				this.refreashSkuMeasuremethod()
		    },
		    changeCustomer(obj, type) {
		    	obj.isAppend = type;
		    	let param = {
		    		id : obj.id,
		    		isAppend : type
		    	};
		    	this._ajax({url: this.rootAPI, name: "promotioncustomermapping/update", param: param})
		    	.then((function(d) {
					this.$message({type: 'success', message: '调整商户成功'});
					this.handleCurrentChange(1)
				}).bind(this))
		    	
		    },
		    changeProduct(obj, type) {
		    	obj.isAppend = type;
		    	let param = {
		    		id : obj.id,
		    		isAppend : type
		    	};
		    	this._ajax({url: this.rootAPI + "promotiondetail/update", param: param})
		    	.then((function(d) {
					this.$message({type: 'success', message: '调整商品成功'});
					this.handleCurrentChange(1)
				}).bind(this))
		    },
		    uploadSuccess(response, file, fileList) {
//          	console.info(response);
            	if(response.state == 0) {
            		this.uploadfile.id = '';
            		this.uploadfile.filePath = response.aaData.path;
	            	this.uploadfile.fileSize = response.aaData.size;
	            	this.uploadfile.fileName = file.name;
	            	let fileTypeTemp = file.name.split('.');
	            	this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
            	}
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    filePath: ''
                });
                this.uploadfile.filePath = ''
            },
            categoryChange(val) {
				if(val.length > 0) {
                    Object.assign(this.form, {categoryId: val[val.length - 1]})
                }else {
                    Object.assign(this.form, {categoryId: ''})
                }
			},
			addTab() {
				this.measureMethodChange(this.form.measureMethod);
		        let newTabName = 'Tab' + ++this.tabIndex;
		        this.editableTabs.push({
		          title: '新建规格',
		          tagName: newTabName,
		          productId : this.form.id,
		          measureType : this.measureType,
		          measureMethodName : this.measureMethodName,
		          measureMethod : this.form.measureMethod,
		          skuMeasuremethodList : this.skuMeasuremethodList,
		        });
		        this.editableTabsValue = newTabName;
		    },
		    removeTab(targetName) {
		    	if(targetName == "addTab") {
		    		this.$message({type: 'info', message: '该页签不允许删除'});
		    		return
		    	}
		    	let tabs = this.editableTabs;
		    	if(targetName) {
		    		this.confirm('确定删除该规格？', (function() {
	        			var arr = [], o = {};
						let activeName = this.editableTabsValue;
				        if (activeName === targetName) {
				          	tabs.forEach((tab, index) => {
				            	if (tab.tagName === targetName) {
				            		if(tab.id)
				            			arr[0] = tab.id;
				              		let nextTab = tabs[index + 1] || tabs[index - 1];
				              		if (nextTab) {
				                		activeName = nextTab.tagName;
				              		}
				            	}
				          	});
				        }
				        
				        this.editableTabsValue = activeName;
				        this.editableTabs = tabs.filter(tab => tab.tagName !== targetName);
				        
				        if(arr.length > 0) {
				        	o.id = arr;
							o.deleted = 1;
							o.published = 2;
							this._ajax({url: this.rootAPI + 'productsku/update', param: o, arr:true})
							.then((function(d) {
								this.$message({type: 'success', message: '删除成功'});
							}).bind(this))
				        }
	        		}).bind(this))
		    	}
		    },
		    modalSubmit() {
		    	this.refreashTab();
		   	},
		   	refreashTab() {
		   		this.measureMethodChange(this.form.measureMethod);
		   		//刷新tab内容
		    	this._ajax({url: this.rootAPI, name: 'productsku/listDto', param: {productId : this.form.id, deleted:0}})
				.then((function(d) {
					let data = d.aaData;
					let skuData = [];
					var vm = this;
					$.each(data, function(i, obj) {
						obj.tagName = obj.id+'';
						obj.title = obj.name;
						obj.measureType = vm.measureType;
						obj.measureMethodName = obj.baseMeasureName;
	          			obj.measureMethod = obj.baseMeasure;
	          			obj.skuMeasuremethodList = vm.skuMeasuremethodList;
//	          			console.info("第二步：", vm.skuMeasuremethodList)
						skuData.push(obj);
						//设置选中刚才选中的tag，如果没有值或者新增，选中最新的tag
						if((!vm.editableTabsValue || vm.editableTabsValue == 0 || vm.editableTabsValue.startsWith("Tab")) && i == 0)
							vm.editableTabsValue = obj.tagName
					});
					this.editableTabs = skuData.reverse();
	            }).bind(this))
		   	},
		   	refreashSkuMeasuremethod() {
		   		let data = [];
		   		let vm = this;
				$.each(this.measuremethodList, function(i, obj) {
					if(obj.methodType == vm.measureType || vm.measureType == '1') data.push(obj)
				});
				this.skuMeasuremethodList = data;
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
