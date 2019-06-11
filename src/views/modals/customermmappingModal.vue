<template>
	<el-dialog custom-class="jz-modal" title="批量修改账期" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>

				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="账期类型" prop="termType">
						<selectInput  :value.sync="form.termType" >
							<el-option v-for="item in dataDic.termTypeOption" :key="item.key" :label="item.value" :value="item.key">
							</el-option>
						</selectInput>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="提醒日期" prop="remindDays">
						<el-input-number v-model="form.remindDays" :precision="1" :controls="false" :max="50" ></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="是否提醒" prop="isRemind">
						<selectInput  :value.sync="form.isRemind" >
							<el-option v-for="item in dataDic.isRemindOption" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</selectInput>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="账期天数" prop="termDays">
						<el-input-number v-model="form.termDays" :precision="1" :controls="false" :max="50" ></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel">取消</elBtn>
			<elBtn @click="submit" type="primary">提交</elBtn>
		</div>
	</el-dialog>
</template>
<script>
	import local from '../../local.js'
	import mixin from '../../mixin/mixin.js'
	import configs from '../../configs.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				userInfo:local.get('sessionUser'),
				form: {
					termType: '001',
					isRemind: '1',
					remindDays: '1',
					termDays: '1',
				},
				dataDic: {
					termTypeOption: [],
					isRemindOption: [{code:'1',name:'是'},{code:'0',name:'否'}],
				},
				customerId: '',
				rules: {
					traCode: [{
						required: true,
						message: '所属商圈不能为空',
						tigger: 'change'
					}]
				},
				flag: true
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
			let user = local.get('sessionUser');
			this.customerId = parseInt(user.typeCode);
			this._searchDic('CUSTMAPP_STATUS')
			.then((function(d) {
				this.dataDic.termTypeOption = d.aaData
			}).bind(this))
				
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {
				let reg = /^\d+$/;
				if(!reg.test(this.form.termDays)) {
					this.$message({type: 'warning', message: '账期天数只能为正整数'});
					return;
				} else if(this.form.termDays > 50) {
					this.$message({type: 'warning', message: '账期天数不能大于50'});
					return;
				}
				if(!reg.test(this.form.remindDays)) {
					this.$message({type: 'warning', message: '账期提醒天数只能为正整数'});
					return;
				} else if(this.form.remindDays > 50) {
					this.$message({type: 'warning', message: '账期提醒天数不能大于50'});
					return;
				}
				if(this.form.remindDays > this.form.termDays) {
					this.$message({
						type: 'warning',
						message: '到期提醒天数不能大于账期天数'
					});
					return;
				}
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var o = {
							typeCode: this.userInfo.typeCode,
							buyerId: this.ids,
							termType: this.form.termType,
							isRemind: this.form.isRemind,
							remindDays: this.form.remindDays,
							termDays: this.form.termDays
						}
						var vm = this;
						this.$emit('add', o);
						this.cancel();
					}
				})
			},
			beforeClose(done) {
				this.cancel()
				done()
			}
		}
	}
</script>