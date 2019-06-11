<template>
	<div class="page-storage">
		<el-form class="modal-form" :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="库房名称" prop="name">
						<inputItem :autosize="true" :value.sync="form.name" class="gerenxinXi"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="库房面积" prop="area">
						<inputItem :autosize="true" :value.sync="form.area" class="gerenxinXi"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="联系人" prop="contact">
						<inputItem :autosize="true" :value.sync="form.contact" class="gerenxinXi"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="联系电话" prop="tel">
						<inputItem :autosize="true" :value.sync="form.tel" class="gerenxinXi"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="库房类型" prop="type">
						<selectInput :value.sync="form.type" class="gerenxinXi">
							<el-option
						      v-for="item in storageTypeList"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="库房地址" prop="add">
						<inputItem type="textarea" :value.sync="form.add" :maxlength="150" class="gerenxinXi"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div class="submitB">
			<elBtn @click="valideSubmit" type="primary">提交</elBtn>
		</div>
   </div>
</template>

<script>
	import local from '../../local.js'
	import configs from '../../configs.js'
	import mixin from '../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				form: {
					id : '',
					name : '',
					area : '',
					tel : '',
					type : '',
					add : '',
					contact : '',
				},
				storageTypeList : [],
				user : local.get('sessionUser'),
				rules: { 
                	name: [{required: true, message: '库房名称必填' }, this._ruleLength(50)],
                	tel: [{required: true, trigger: 'blur', message: '联系电话必填' }, this._ruleLength(20)]
                },
			}
		},
		props: {
			storageInfo: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {
			Object.assign(this.form, this.storageInfo)
			this._searchDic('STORAGE_TYPE')
            .then((function(d) {
//              this.storageTypeList = this._dicKey(d)
				this.storageTypeList = d.aaData
            }).bind(this))
		},
		methods: {
			valideSubmit() {
				this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = "storage/create";
                        let id = this.form.id;
                        if(id) {
                            method = "storage/update";
                        }
                        o = {
								id : id,
								name : this.form.name,
								area : this.form.area,
								tel : this.form.tel,
								type : this.form.type,
								add : this.form.add,
								contact : this.form.contact,
								enabled : 1,
                            }
//                      console.info(o);
                        if(!id) {
                            o.createdPersonId = this.user.userId;
							o.createdPersonName = this.user.nickName;
							o.customerId = this.user.typeCode;
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		if(!id) this.form.id = d.aaData.id;
                        		this.$message({ type: 'success', message: '操作成功' });
                        		this.$emit('submit');
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败：'+d.msg }); 
                        	}
                        }).bind(this))
                    }
                })
			},
			cancel() {
				this.$router.push({name : 'supplierManager'});
			},
		}
	}
</script>
<style lang="sass">
	.jibenxinxi {
		padding: 20px;
		margin: 0 auto;
		text-align: center;
				/*二维码背景图*/
		.el-form-item__content {
			width: 600px;
			text-align: left;
		}
		.gerenxinXi {
			width: 600px;
			text-align: left;
		}
		.gerenxinXi_1 {
			width: 600px;
			text-align: left;
			border: 1px solid #D1D1D1;
			line-height: 30px;
			border-radius: 5px;
			display: block;
			padding-left: 15px;
			.bingjingBJ{
				width:330px;
				height:640px;
			}
		}
		.gerenxinX3 {
			width: 600px;
			text-align: left;
			float: left;
			border: 1px solid #FDFDFD;
			padding: 10px;
			border-radius: 5px;
		}
		.Mapboxstyle {
			width: 100%;
			.gerenxinXi_map {
				width: 600px;
				text-align: left;
			}
			.gerenxinXi_map1 {
				width: 540px;
				text-align: left;
			}
			.gerenxinXi_1_map {
				width: 450px;
				text-align: left;
				float: left;
			}
			.gerenxinXi_1_map_XQ {
				width: 600px;
				text-align: left;
				float: left;
				padding-left: 16px;
				border: 1px solid #dcdfe6;
				border-radius: 5px;
			}
			.ditixianze {
				width: 140px;
				height: 80px;
				position: absolute;
				top: 20px;
				right: 10px;
				text-align: center;
				cursor: pointer;
			}
			.ditixianze img {
				width: 60px;
			}
			.ditixianze_span {
				font-size: 14px;
				font-family: "微软雅黑";
			}
		}
	}
</style>