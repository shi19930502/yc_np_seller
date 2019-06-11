<template>
	<el-dialog custom-class="jz-modal"  :width='eWidth' title="盘点详情" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<div class="page-supplier">
			<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
				<el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
		                <el-form-item label="盘点单号" prop="inventoryNumber">
		                    <inputItem :autosize="true" :value.sync="form.inventoryNumber" :disabled="true"></inputItem>
		                </el-form-item>
		            </el-col>
		        </el-row>
		        <el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
		                <el-form-item label="盘点日期" prop="inventoryDate">
		                    <!-- <div class="block">
								<el-date-picker v-model="form.inventoryDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
							</div> -->
							<div class="block">
								{{form.inventoryDate}}
							</div>
		                </el-form-item>
		            </el-col>
		            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
		                <el-form-item label="所属库房" prop="storageId"  >
                            <selectInput :clearable='true' :value.sync="form.storageId" :disabled="true">
                                <el-option
                                  v-for="item in storageList"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                            </selectInput>
                        </el-form-item>
		            </el-col>
		        </el-row>
		        <el-row>
		            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
		                <el-form-item label="备注" prop="comment" class="row-block">
		                    <inputItem type="textarea" :value.sync="form.comment" :disabled="true"></inputItem>
		                </el-form-item>
		            </el-col>
		        </el-row>
		   </el-form>
		      <el-tabs v-model="tabModal">
                <el-tab-pane label="商品列表" name="first">
				    <!-- 表格 -->
					<el-table :data="productTableData" style="width: 100%">
						<el-table-column prop="productName" label="商品名称">
					  	</el-table-column>
					  	<el-table-column prop="skuName" label="规格">
					  	</el-table-column>
					  	<el-table-column prop="skuStockQuantity" label="账面数">
					  		<template slot-scope="scope">
								<toolTip :content="scope.row.stockQuantity/100">
									<span>{{scope.row.stockQuantity/100}}</span>
								</toolTip>
							</template>
					  	</el-table-column>
					  	<el-table-column prop="inventoryStock" label="实盘数">
					  		<template slot-scope="scope">
								<toolTip :content="scope.row.inventoryStock/100">
									<span>{{scope.row.inventoryStock/100}}</span>
								</toolTip>
							</template>
					  	</el-table-column>
					  	<el-table-column prop="" label="差异">
					  		<template slot-scope="scope">
					  			<span>{{_parseFloat((scope.row.inventoryStock == null ? 0 : scope.row.inventoryStock/100).sub(scope.row.stockQuantity.div(100)), 2)}}</span>
				  			</template>
					  	</el-table-column>
					</el-table>
				</el-tab-pane>
            </el-tabs>   
	   </div>
	   <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消">取消</elBtn>
        </div>
   </el-dialog>
</template>

<script>
	var productTableIds = [];
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		props: {
			modal: {
				default: false,
			},
			tableRow: {
				default: function() {
					return {}
				},
			}
		},
		data() {
			return {
				keyWord:'',
				form: {
					id : '',
					inventoryDate : '',
					comment : '',
					inventoryNumber : '',
					inventoryStatus : ''
				},
				rules: {
                	
                },
				productModal: false,
				productTableData: [],
				measuremethodList: [],
				multipleSelectionProduct:[],
				storageList: [],
				tabModal: 'first',
			}
		},
		mounted() {
			var params = this.tableRow;
			Object.assign(this.form, params);
			if(params.id)
				this.refreashJoinInProduct();
			productTableIds = [];
			
			this._ajax({url: this.rootAPI, name: 'storage/list', param: {customerId : local.get('sessionUser').typeCode, enabled : 1}})
             .then((function(d) {
                this.storageList = d.aaData
            }).bind(this))
		},
		methods: {
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
						return false;
					}
				});
				return dataShow;
			},
			/*刷新已加入商品*/
		    refreashJoinInProduct() {
		    	let param = {
					mainId : this.form.id,
	        	};
				this._ajax({url: this.rootAPI, name: "inventorydetail/list", param: param})
	            .then((function(d){
	            	this.productTableData = d.aaData;
	            	if(this.productTableData.length > 0) {
	            		let data = this.productTableData;
	            		$.each(data, function(i, obj) {
	            			productTableIds.push(obj.skuId);
	            		});
	            	}
	            }).bind(this))
		    },
            beforeClose(done) {
				this.cancel();
				done()
			},
			cancel() {
				this.$emit('close')
			}
		}
	}
	
</script>
<style lang="sass">
    .page-supplier{
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
    .baseCard{
    	margin-top : -20px;
    }
</style>