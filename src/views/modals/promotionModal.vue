<template>
	<div class="page-channel">
		<el-card class="box-card baseCard">
			<div slot="header" class="clearfix">
				<span>活动基本信息</span>
			</div>
			<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
				<el-row>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="活动名称" prop="promotionTitle">
							<inputItem :autosize="true" :value.sync="form.promotionTitle"></inputItem>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="活动时间" prop="dateRange">
							<dateEditorDaterange :dateValue.sync="dateRange" type="datetimerange" valueFormat="yyyy-MM-dd HH:mm:ss"></dateEditorDaterange>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="报价单" prop="quotationId">
							<selectInput :value.sync="form.quotationId" @selectChange="quotationIdChange">
								<el-option v-for="item in quotationList" :key="item.id" :label="item.quotationTitle" :value="item.id">
								</el-option>
							</selectInput>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="是否启用" prop="promotionStatus">
							<selectInput :value.sync="form.promotionStatus">
								<el-option v-for="item in dataDic.isEnabled" :key="item.value" :label="item.value" :value="item.key">
								</el-option>
							</selectInput>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="活动介绍" prop="promotionComment" class="row-block">
							<inputItem type="textarea" :value.sync="form.promotionComment"></inputItem>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div style="text-align: right">
				<elBtn @click="cancel" type="info">取消</elBtn>
				<iconBtn @click="valideSubmit" content="提交" type="primary" class="el-icon-check" v-if="promotionState != 2">提交</iconBtn>
			</div>
		</el-card>
		<el-row :gutter="10">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>客户列表</span>
					</div>
					<div>
						<optionItems style="float: left;width：120px;">
							<template slot="left">
								<el-button-group>
									<iconBtn iconClass="el-icon-plus" content="新增" @click="showCustomerDialog" v-if="promotionState != 2"></iconBtn>
								</el-button-group>
							</template>
						</optionItems>
						<searchInputItems style="float:right;width:510px">
							<searchInputItem>
								<inputItem :value.sync="customerName" placeHolder="请输入客户名称查询"></inputItem>
							</searchInputItem>
							<optionItems style="padding: 0;">
								<template slot="left">
									<el-button-group>
										<iconBtn iconClass="el-icon-search" content="查询" @click="refreashJoinInCustomer()" type="primary">查询</iconBtn>
										<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetSearchCustomer">重置</iconBtn>
									</el-button-group>
								</template>
							</optionItems>
						</searchInputItems>
					</div>
					<elemTable :dataList="customerTableData" :currentPage='pageNum' :pageSize="customerPageSize" :pageTotal="customerPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="customerListPage" @selectionChange="refreashJoinInCustomer" :showPagination="false">
						<el-table-column prop="customerName" label="客户姓名">
							<template slot-scope="scope">
								<toolTip :content="scope.row.customerName">
									<span>{{scope.row.customerName}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button-group>
									<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeCustomer(scope.row, 0)" v-if="promotionState != 2"></iconBtn>
								</el-button-group>
							</template>
						</el-table-column>
					</elemTable>
					<el-dialog custom-class="jz-modal" title="用户列表" :visible="customerModal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
						<searchInputItems>
							<searchInputItem name="关键字">
								<inputItem :value.sync="keyWord" placeHolder="请输入关键字"></inputItem>
							</searchInputItem>
						</searchInputItems>
						<!-- 操作按钮 -->
						<optionItems>
							<template slot="right">
								<el-button-group>
									<iconBtn iconClass="el-icon-search" content="查询" @click="refreashCustomerDialog" type="primary">查询</iconBtn>
									<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetCustomerDialog">重置</iconBtn>
								</el-button-group>
							</template>
						</optionItems>
						<elemTable :dataList="customerDialogDataList" :currentPage='customerDialogPageNum' :pageSize="customerDialogPageSize"
							 :pageTotal="customerDialogPageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" 
							 @selectionChange="customerSelectionChange" :showPagination="false">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="customerName" label="商户名称">
								<template slot-scope="scope">
									<toolTip :content="scope.row.customerName">
										<span>{{scope.row.customerName}}</span>
									</toolTip>
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button-group>
										<iconBtn type="primary" content="加入活动" @click="changeCustomer(scope.row, 1)">加入活动</iconBtn>
									</el-button-group>
								</template>
							</el-table-column>
						</elemTable>
						<div class="flex-x-end" >
					      <el-pagination
					        @size-change="customerDialogHandleSizeChange"
					        @current-change="customerDialogHandleCurrentChange"
					        :current-page="customerDialogPageNum"
					        :page-sizes="pageSizes"
					        :page-size="customerDialogPageSize"
					        layout="total, sizes, prev, pager, next, jumper"
					        :total="customerDialogPageTotal">
					      </el-pagination>
						</div>
						<div class="submitB">
							<elBtn @click="batchAddCustomer" type="primary">批量添加</elBtn>
						</div>
					</el-dialog>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>商品列表</span>
					</div>
					<optionItems>
						<template slot="left">
							<el-button-group>
								<iconBtn iconClass="el-icon-plus" content="新增" @click="showProductDialog" v-if="promotionState != 2"></iconBtn>
							</el-button-group>
							<div style="display:inline-block;">
								<selectInput :value.sync="batchDiscountType">
									<el-option v-for="item in dataDic.promotionType" :key="item.value" :label="item.value" :value="item.key">
									</el-option>
								</selectInput>
							</div>
							<div style="display:inline-block;">
								<inputItem :value.sync="batchDiscountTypeValue" :append="true">
									<elBtn @click="batchSetDiscountType()" text="批量设置折扣" type="primary" slot="append">批量设置折扣</elBtn>
								</inputItem>
							</div>
						</template>
						<template slot="right">
							<inputItem :value.sync="productSearch.keyWord" :append="true">
								<elBtn @click="refreashJoinInProduct()" text="选择" type="primary" slot="append">搜索</elBtn>
								<elBtn @click="clearSearchProduct()" text="重置" type="primary" slot="append">重置</elBtn>
							</inputItem>
						</template>
					</optionItems>
					<elemTable :dataList="productTableDataTemp" :currentPage='productPageNum' :pageSize="productPageSize" :pageTotal="productPageTotal" 
						:loading="dataLoading" @sizeChange="productHandleSizeChange" @currentChange="productHandleCurrentChange" 
						@selectionChange="joinProductSelectionChange" :showPagination="false">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column prop="productName" label="商品名称">
						</el-table-column>
						<el-table-column prop="skuName" label="规格">
						</el-table-column>
						<el-table-column prop="skuMeasure" label="单位">
							<template slot-scope="scope">
								<toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
									<span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
								</toolTip>
							</template>
						</el-table-column>
						<el-table-column prop="basePrice" label="参考成本">
						</el-table-column>
						<el-table-column prop="price" label="原价">
						</el-table-column>
						<el-table-column prop="discountType" label="折扣方式">
							<template slot-scope="scope">
								<selectInput :value.sync="scope.row.discountType">
									<el-option v-for="item in dataDic.promotionType" :key="item.value" :label="item.value" :value="item.key">
									</el-option>
								</selectInput>
							</template>
						</el-table-column>
						<el-table-column prop="promotionData" label="折扣值">
							<template slot-scope="scope">
								<inputItem :autosize="true" :value.sync="scope.row.promotionData"></inputItem>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="100">
							<template slot-scope="scope">
								<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="changeProduct(scope.row)" v-if="promotionState != 2"></iconBtn>
							</template>
						</el-table-column>
					</elemTable>
					<div class="flex-x-end" >
				      <el-pagination
				        @size-change="productHandleSizeChange"
				        @current-change="productHandleCurrentChange"
				        :current-page="productPageNum"
				        :page-sizes="pageSizes"
				        :page-size="productPageSize"
				        layout="total, sizes, prev, pager, next, jumper"
				        :total="productPageTotal">
				      </el-pagination>
					</div>
					<!--商品列表-->
					<el-dialog custom-class="jz-modal" title="商品列表" :visible="productModal" :before-close="productBeforeClose" :close-on-click-modal="false" :width="modalWidth">
						<searchInputItems>
							<searchInputItem name="关键字">
								<inputItem :value.sync="keyWord" placeHolder="请输入关键字"></inputItem>
							</searchInputItem>
						</searchInputItems>
						<!-- 操作按钮 -->
						<optionItems>
							<template slot="right">
								<el-button-group>
									<iconBtn iconClass="el-icon-search" content="查询" @click="refreashProductDialog" type="primary">查询</iconBtn>
									<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetProductDialog">重置</iconBtn>
								</el-button-group>
							</template>
						</optionItems>
						<elemTable :dataList="productDialogDataList" :currentPage='productDialogPageNum' :pageSize="productDialogPageSize" 
							:pageTotal="productDialogPageTotal" :loading="dataLoading" @sizeChange="productDialogHandleSizeChange" 
							@currentChange="productDialogHandleCurrentChange" :showPagination="false"
                                   @selectionChange="selectionChangeTag" :showSelects="true" :selectedRows="selectedRows" :selectedRowKey="selectedRowKey" :selectedRowName="selectedRowName" @handleSelectedDel="handleSelectedDelTag" ref="tableTag">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="customerName" label="商品名称">
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
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button-group>
										<iconBtn type="primary" content="加入活动" @click="changeProduct(scope.row, 1)" v-if="scope.row.isAppend == null || scope.row.isAppend == 2">加入活动</iconBtn>
									</el-button-group>
								</template>
							</el-table-column>
						</elemTable>
						<div class="flex-x-end" >
					      <el-pagination
					        @size-change="productDialogHandleSizeChange" 
					        @current-change="productDialogHandleCurrentChange"
					        :current-page="productDialogPageNum"
					        :page-sizes="pageSizes"
					        :page-size="productDialogPageSize"
					        layout="total, sizes, prev, pager, next, jumper"
					        :total="productDialogPageTotal">
					      </el-pagination>
						</div>
						<div class="submitB">
							<elBtn @click="batchAddProduct" type="primary">批量添加</elBtn>
						</div>
					</el-dialog>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	var quotationIdTemp = '';
	var mainId = '';
	var customerTableIds = [];
	var productTableIds = [];
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				dateRange: [],
				keyWord: '',
				form: {
					id: '',
					quotationId: '',
					promotionTitle: '',
					discountType: '1',
					discountRatio: 0,
					discountAmount: 0,
					lockPrice: 0,
					promotionStatus: 1,
					promotionComment: ''
				},
				rules: {
					quotationId: [{
						required: true,
						message: '报价单必选'
					}],
					/*dateRange: [{required: true, message: '活动时间必选' }],*/
					promotionTitle: [{
						required: true,
						message: '活动名称必填'
					}, this._ruleLength(50)],
					discountType: [{
						required: true,
						message: '折扣方式必选'
					}]
				},
				dataDic: {
					isEnabled: '',
					promotionType: ''
				},
				dataList: [],
				rowOBJ: {},
				selectType1: false,
				selectType2: true,
				selectType3: true,
				quotationList: [],
				customerModal: false,
				productModal: false,
				measuremethodList: [],
				customerTableData: [],
				productTableData: [],
				productTableDataTemp: [],
				multipleSelectionCustomer: [],
				multipleSelectionProduct: [],
				productSearch: {
					keyWord: '',
					pageNum:'',
					pageSize:''
				},
				multipleSelectionJoinProduct: [],
				batchDiscountType: '',
				batchDiscountTypeValue: '',
				catchProduct: [],
				isCustomer: true,
				promotionState: '',
				customerName: '',
				productPageTotal:0,
				productPageSize:10,
				productPageNum:1,
				customerPageSize: 30,
				customerDialogDataList : [],
				customerDialogPageTotal : 0,
				customerDialogPageNum : 1,
				customerDialogPageSize : 10,
				productDialogDataList : [],
				productDialogPageTotal : 0,
				productDialogPageNum : 1,
				productDialogPageSize : 10,
			}
		},
		mounted() {
			let paramsTemp = this.$route.query;
			let idTemp = paramsTemp.id;
			if(idTemp) {
				let paramTemp = {
					pageNum: 1,
					pageSize: 1,
					id: idTemp
				};
				this._ajax({
						name: 'promotion/list',
						param: paramTemp
					})
					.then((function(d) {
						let params = d.aaData[0];
						this.promotionState = params.promotionStatus;
						Object.assign(this.form, params);
						mainId = this.form.id;
						if(mainId) {
							//						this.dateRange[0] = params.startDate
							//						this.dateRange[1] = moment(params.endDate).format('YYYY-MM-DD')
							this.dateRange = [params.startDate, params.endDate]
						}
						this.refreashJoinInCustomer();
						this.refreashJoinInProduct();
					}).bind(this))
			} else this.productPageSize = 40
			this.getInitData();
			this.discountTypeChange();
			customerTableIds = [];
			productTableIds = [];
		},
		methods: {
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
					}
				});
				return dataShow;
			},
			getInitData() {
				//基础单位
				this._ajax({
						url: this.rootAPI,
						name: 'measuremethod/list',
						param: {}
					})
					.then((function(d) {
						this.measuremethodList = d.aaData;
					}).bind(this));
				this._searchDic('PROMOTION_TYPE').then((function(d) {
					Object.assign(this.dataDic, {
						promotionType: d.aaData
					})
				}).bind(this));
				this._ajax({
						name: 'datadic/listAll',
						param: {
							'dataType': 'IS_ENABLED'
						}
					})
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							isEnabled: data
						})
					}).bind(this));

				this._ajax({
						url: this.rootAPI,
						name: 'quotation/list',
						param: {
							enabled: 1
						}
					})
					.then((function(d) {
						//	                Object.assign(this.quotationList, d.aaData)
						this.quotationList = d.aaData
					}).bind(this))
			},
			customerListPage(val) {
				this.pageNum = val;
				this.refreashJoinInCustomer()
			},
			valideSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.dateRange.length < 2) {
							this.$message({
								type: 'warning',
								message: '请选择活动时间'
							});
							return;
						}
						if(this.customerTableData.length == 0 || this.productTableData.length == 0) {
							this.$message({
								type: 'warning',
								message: '客户和商品不能为空'
							});
							return;
						}
						/*if(!this.form.lockPrice && !this.form.discountRatio && !this.form.discountAmount) {
							this.$message({ type: 'success', message: '活动折扣值必填' });
                    		return;
						}
						if(!this.regFloatPlus.test(this.form.lockPrice) || !this.regFloatPlus.test(this.form.discountRatio) || !this.regFloatPlus.test(this.form.discountAmount)) {
							this.$message({ type: 'success', message: '活动折扣值必须是数字型的值' });
                    		return;
						}*/
						let productDataTemp = this.productTableData;
						let productData = [];
						let flag1 = false;
						let flag2 = false;
						let flag3 = false;
						let msg = '';
						$.each(productDataTemp, function(i, obj) {
							let discountType = obj.discountType;
							let discountRatio, discountAmount, lockPrice;
							if(!discountType) {
								flag1 = true;
								return false;
							}
							if(!obj.promotionData) {
								flag2 = true;
								return false;
							}
							if(discountType == 1) {
								//折扣比例
								let reg = /^[0-9]{0,2}(\.[0-9]{1,2})*$/;
								if(!reg.test(obj.promotionData) || parseFloat(obj.promotionData) <=0) {
									flag3 = true;
									msg = "商品：" + obj.productName + ",规格：" + obj.skuName + "的折扣比例" + obj.promotionData + "不符合规定（折扣比例必须是0-99.99）";
								}
								obj.discountRatio = obj.promotionData;
								obj.discountAmount = null;
								obj.lockPrice = null
							} else if(discountType == 2) {
								//现金折扣
								if(parseFloat(obj.promotionData) >= parseFloat(obj.price)){
									flag3 = true;
									msg = "商品：" + obj.productName + ",规格：" + obj.skuName + "现金折扣优惠价格必须小于原始售价";
								}
								let reg = /^[\+\-]?[0-9]{0,10}(\.[\d]{1,2})?$/;
								if(!reg.test(obj.promotionData)) {
									flag3 = true;
									msg = "商品：" + obj.productName + ",规格：" + obj.skuName + "的现金折" + obj.promotionData + "扣不符合规定（现金折扣必须是-9999999999.99-9999999999.99）";
								}
								
								obj.discountRatio = null;
								obj.discountAmount = obj.promotionData;
								obj.lockPrice = null
							} else if(discountType == 3) {
								//固定价
								let reg = /^[0-9]{0,4}(\.[0-9]{1,2})*$/;
								if(!reg.test(obj.promotionData) || parseFloat(obj.promotionData) <= 0 || parseFloat(obj.promotionData) > obj.price) {
									flag3 = true;
									msg = "商品：" + obj.productName + ",规格：" + obj.skuName + "的固定价" + obj.promotionData + "不符合规定（固定价必须是0-9999.99且小于原价）";
								}
								obj.discountRatio = null;
								obj.discountAmount = null;
								obj.lockPrice = obj.promotionData
							}
							productData.push(obj);
						});
						if(flag1) {
							this.$message({
								type: 'warning',
								message: '还有活动商品折扣方式未选'
							});
							return;
						}
						if(flag2) {
							this.$message({
								type: 'warning',
								message: '还有活动商品价格未填'
							});
							return;
						}
						if(flag3) {
							this.$message({
								type: 'warning',
								message: msg
							});
							return;
						}
						let o = {},
							method = "promotion/createRelate";
						let id = this.form.id;
						//                      console.info(id);
						if(id) {
							method = "promotion/updateRelate";
						}
						o = {
							quotationId: this.form.quotationId,
							promotionTitle: this.form.promotionTitle,
							discountType: this.form.discountType,
							discountRatio: this.form.discountRatio,
							discountAmount: this.form.discountAmount,
							lockPrice: this.form.lockPrice,
							promotionStatus: this.form.promotionStatus,
							promotionComment: this.form.promotionComment,
							startDate: this.dateRange[0],
							endDate: this.dateRange[1],
							id: id,
							customerTableData: JSON.stringify(this.customerTableData),
							productTableData: JSON.stringify(this.productTableData)
						};
						let user = local.get('sessionUser');
						if(!id) {
							o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
						}
						this._ajax({
								url: this.rootAPI + method,
								param: o
							})
							.then((function(d) {
								if(d.state == 0) {
									if(!id)
										this.form.id = d.aaData.id;
									let vm = this;
									this.$confirm('是否跳转回列表？', '确认信息', {
							          distinguishCancelAndClose: true,
							        })
	                        		.then(() => {
	                        			vm.cancel();
							        })
							        .catch(action => {
		                        		vm.$message({ type: 'success', message: '操作成功' });
							        });
								} else {
									this.$message({
										type: 'failure',
										message: '操作失败:' + d.msg
									});
								}
								this.$emit('submit')
							}).bind(this))
					}
				})
			},
			/*改变优惠方式控制*/
			discountTypeChange() {
				let promotionType = this.form.discountType;
				if(promotionType == 1) {
					this.selectType1 = false;
					this.selectType2 = true;
					this.selectType3 = true;
					this.form.discountAmount = 0;
					this.form.lockPrice = 0
				} else if(promotionType == 2) {
					this.selectType1 = true;
					this.selectType2 = false;
					this.selectType3 = true;
					this.form.discountRatio = 0;
					this.form.lockPrice = 0
				} else if(promotionType == 3) {
					this.selectType1 = true;
					this.selectType2 = true;
					this.selectType3 = false;
					this.form.discountRatio = 0;
					this.form.discountAmount = 0;
				}
			},
			quotationIdChange() {
				quotationIdTemp = this.form.quotationId;
				this.productTableData = [];
				this.productTableDataTemp = [];
				this.customerTableData = [];
				this.productPageTotal = 0;
			},
			changeCustomer(row, type, isBatch) {
				if(type == '1') {
					var index = customerTableIds.indexOf(row.customerId);
					if(index < 0) {
						this.customerTableData.push({
							customerId: row.customerId,
							customerName: row.customerName
						});
						customerTableIds.push(row.customerId);
						if(!isBatch)
							this.refreashCustomerDialog();
					} else {
						this.$message({
							type: 'failure',
							message: '该商品规格已加入促销列表'
						});
					}
				} else {
					//删除ids
					let customerId = row.customerId;
					var index = customerTableIds.indexOf(customerId);
					customerTableIds.splice(index, 1);
					//删除表格数据
					let tableData = this.customerTableData;
					let indexTemp;
					$.each(tableData, function(i, obj) {
						if(obj.customerId == customerId) {
							indexTemp = i;
						}
					});
					tableData.splice(indexTemp, 1);
					this.customerTableData = tableData;
				}
			},
			productHandleSizeChange(val) {
				this.productPageSize = val;
				this.changeProductList();
			},
			productHandleCurrentChange(val) {
		        this.productPageNum = val;
		        this.changeProductList();
	      	},
			changeProduct(row, type, isBatch) {
				if(type == '1') {
					var index = productTableIds.indexOf(row.skuId);
					if(index < 0) {
						let productSku = {
							productId: row.productId,
							productName: row.productName,
							skuId: row.skuId,
							skuName: row.skuName,
							basePrice: row.basePrice,
							skuMeasure: row.skuMeasure,
							skuPicUrl: row.skuPicUrl,
							price: row.price,
							discountType: '1',
							promotionData: 0,
						};
						this.productTableData.unshift(productSku);  
						this.productPageTotal += 1;
						this.catchProduct.unshift(productSku);
						productTableIds.push(row.skuId);
						if(!isBatch)
							this.refreashProductDialog();
					} else {
						this.$message({
							type: 'failure',
							message: '该商品规格已加入盘点列表'
						});
					}
				} else {
					//删除ids
					let skuId = row.skuId;
					var index = productTableIds.indexOf(skuId);
					productTableIds.splice(index, 1);
					//删除表格数据
					let tableData = this.productTableData;
					let indexTemp;
					$.each(tableData, function(i, obj) {
						if(obj.skuId == skuId) {
							indexTemp = i;
						}
					});
					tableData.splice(indexTemp, 1);
					this.catchProduct.splice(indexTemp, 1);
					this.productPageTotal -= 1;
					this.productTableData = tableData;
				}
				this.changeProductList();
			},
			/*商户弹出框*/
			showCustomerDialog() {
				if(!this.form.quotationId) {
					this.$message({
						type: 'success',
						message: '请选择报价单'
					});
					return
				}
				this.customerModal = true;
				this.customerDialogPageNum = 1;
				this.refreashCustomerDialog();
			},
			/*商品弹出框*/
			showProductDialog() {
				if(!this.form.quotationId) {
					this.$message({
						type: 'success',
						message: '请选择报价单'
					});
					return
				}
				this.productModal = true;
				this.productDialogPageNum = 1;
                this.selectedRowKey = 'skuId'
                this.selectedRowName = 'skuName'
                this.dataListName = 'productDialogDataList'
				this.refreashProductDialog();
			},
			/*刷新已加入活动商户*/
			refreashJoinInCustomer() {
//				console.info(this.form.id);
				if(this.form.id) {
					let param = {
						mainId: this.form.id,
						customerId: 0,
						pageNum: this.customerPageNum,
						pageSize: this.customerPageSize,
						customerName: this.customerName
					};
					this._ajax({
						url: this.rootAPI,
						name: "promotioncustomermapping/list",
						param: param
					})
					.then((function(d) {
						this.customerTableData = d.aaData;
						this.pageTotal = d.dataCount;
						if(this.customerTableData.length > 0) {
							let data = this.customerTableData;
							$.each(data, function(i, obj) {
								customerTableIds.push(obj.customerId);
							});
						}
					}).bind(this))
				}
			},
			resetSearchCustomer() {
				this.customerName = '';
				this.refreashJoinInCustomer()
			},
			/*刷新已加入商品*/
			refreashJoinInProduct() {
				if(this.form.id) {
					Object.assign(this.productSearch, {
						mainId: this.form.id,
						pageNum:this.productPageNum,
						pageSize:10000
					});
					//		    	console.info(this.productSearch)
					this._ajax({
							url: this.rootAPI,
							name: "promotiondetail/getRelatedProductlist",
							param: this.productSearch
						})
						.then((function(d) {
							let data = d.aaData;
							let productTableDataTemp = [];
							this.productPageTotal = d.dataCount;
							if(data.length > 0) {
								$.each(data, function(i, obj) {
									productTableIds.push(obj.skuId);
									if(obj.discountType == 1) {
										obj.promotionData = obj.discountRatio;
									} else if(obj.discountType == 2) {
										obj.promotionData = obj.discountAmount;
									} else if(obj.discountType == 3) {
										obj.promotionData = obj.lockPrice;
									}
									productTableDataTemp.push(obj);
								});
							}
							this.productTableData = productTableDataTemp;
							//添加新增的缓存的商品数据
							if(this.catchProduct.length > 0) {
								let vm = this;
								$.each(this.catchProduct, function(i, obj) {
									vm.productTableData.unshift(obj)
								});
							}
							this.changeProductList();
						}).bind(this))
				} else {
					if(this.catchProduct.length > 0) {
						let vm = this;
						vm.productTableData = [];
						$.each(this.catchProduct, function(i, obj) {
							vm.productTableData.unshift(obj)
						});
						this.changeProductList();
					}
				}
			},
			changeProductList() {
				this.productTableDataTemp = [];
				this.productTableDataTemp = this.productTableData.slice((this.productPageNum - 1) * this.productPageSize, this.productPageNum * this.productPageSize);
//				console.info(this.productTableDataTemp)
			},
			/*刷新弹出框商户列表*/
			refreashCustomerDialog() {
				this.isCustomer = true;
				//刷新列表
				let param = {
					pageNum: this.customerDialogPageNum,
					pageSize: this.customerDialogPageSize,
					mainId: this.form.quotationId,
					keyWord: this.keyWord,
					customerId: 0,
					joininCustomerIdsString: customerTableIds.join(",")
				};
				//查询报价单数据
				this._ajax({
					url: this.rootAPI,
					name: "quotationcustomermapping/list",
					param: param,
					loading: 'dataLoading'
				})
				.then((function(d) {
					this.customerDialogDataList = d.aaData;
					this.customerDialogPageTotal = d.dataCount;
				}).bind(this))
			},
			searchTable() {
				/*this.refreashJoinInCustomer();
				this.refreashJoinInProduct();
				if(this.isCustomer)
					this.refreashCustomerDialog();
				else
					this.refreashProductDialog();*/
			},
			/*刷新商品弹出框列表*/
			refreashProductDialog() {
				this.isCustomer = false;
				//刷新列表
				var param = {
					pageNum: this.productDialogPageNum,
					pageSize: this.productDialogPageSize,
					mainId: this.form.quotationId,
					keyWord: this.keyWord,
					joininSkuIdsString: productTableIds.join(",")
					//extend: "promotion"
				};
				//查询报价单数据
				this._ajax({
					url: this.rootAPI,
					name: "quotationdetail/listDto",
					param: param,
					loading: 'dataLoading'
				}).then((function(d){
					this.productDialogDataList = d.aaData;
					this.productDialogPageTotal = d.dataCount;
                    this.$nextTick((function () {
                        this._renderAgain()
                    }).bind(this))
				}).bind(this))
			},
			/*关闭商户弹出框*/
			beforeClose() {
				this.customerModal = false;
			},
			productBeforeClose() {
				this.productModal = false;
			},
			cancel() {
				this.$router.push({
					name: 'promotion'
				});
			},
			batchAddCustomer() {
				let data = this.multipleSelectionCustomer;
				let vm = this;
				$.each(data, function(i, obj) {
					vm.changeCustomer(obj, '1', true)
				});
				this.customerModal = false;
				//		    	this.refreashCustomerDialog();
			},
			customerSelectionChange(val) {
				this.multipleSelectionCustomer = val;
			},
			batchAddProduct() {
                let data = this.selectedRows;
				let vm = this;
				$.each(data, function(i, row) {
					vm.changeProduct(row, '1', true);
				});
				this.productModal = false;
				//this.refreashProductDialog();
			},
			productSelectionChange(val) {
				this.multipleSelectionProduct = val;
			},
			resetCustomerDialog() {
				this.keyWord = '';
				this.refreashCustomerDialog();
			},
			resetProductDialog() {
				this.keyWord = '';
				this.refreashProductDialog();
			},
			joinProductSelectionChange(val) {
				this.multipleSelectionJoinProduct = val;
			},
			batchSetDiscountType() {
				//批量设置折扣方式和折扣值
				let vm = this;
				if(!vm.batchDiscountType || !vm.batchDiscountTypeValue) {
					this.$message({
						type: 'warning',
						message: '请选择要批量设置的折扣方式，并填上批量值'
					});
					return
				}
				let data = this.multipleSelectionJoinProduct;
				if(data.length == 0) {
					this.$message({
						type: 'warning',
						message: '请选择已添加的商品数据'
					});
					return
				}
				$.each(data, function(i, obj) {
					obj.discountType = vm.batchDiscountType;
					obj.promotionData = vm.batchDiscountTypeValue;
				});
			},
			clearSearchProduct() {
				this.productSearch.keyWord = '';
				this.refreashJoinInProduct()
			},
			customerDialogHandleSizeChange(val) {
				this.customerDialogPageSize = val
				this.refreashCustomerDialog()
			},
			customerDialogHandleCurrentChange(val) {
				this.customerDialogPageNum = val
				this.refreashCustomerDialog()
			},
			productDialogHandleSizeChange(val) {
                this.tmpSelectRows = this.selectedRows
				this.productDialogPageSize = val
				this.refreashProductDialog()
			},
			productDialogHandleCurrentChange(val) {
                this.tmpSelectRows = this.selectedRows
				this.productDialogPageNum = val
				this.refreashProductDialog()
			},
            _renderAgain() {
                this.renderTableSelectedTag()
            },
		}
	}
</script>
<style lang="sass">
	.page-channel {
		.row-block {
			width: 100%;
			.el-form-item__content {
				width: calc(100% - 150px);
				&>div {
					width: 100%;
				}
			}
		}
	}
	
	.baseCard {
		margin-top: -20px;
	}
</style>