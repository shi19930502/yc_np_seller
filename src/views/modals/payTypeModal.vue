<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <div>
            <el-radio v-model="payType" label="0">现金支付</el-radio>
            <el-radio v-model="payType" label="1">POS刷卡</el-radio>
            <el-radio v-model="payType" label="2">微信支付</el-radio>
            <el-radio v-model="payType" label="3">支付宝支付</el-radio>
        </div>   
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="150px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="收款金额(元)" prop="total">
                        <inputItem :value.sync="form.total"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>     
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel">取消</elBtn>
            <elBtn type="primary" @click="submit">确认提交</elBtn>
        </div>
    </el-dialog>
</template>
<script>
import mixin from '../../mixin/mixin.js'
import configs from '../../configs.js'
import local from './../../local.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                payType: '0',
                form: {
                    total: 0
                },
                rules: {
                    total: [{required: true, message: '金额为空' }, this._ruleTwoFloat()]
                },
			}
		},
		props: {
			modal: {
				default: false
			},
            title: {
                default: '选择收款方式'
            },
            params: {
                default: function() {
                    return {}
                }
            },
		},
		mounted() {
            console.log(this.params)
            Object.assign(this.form, {
                total: this._priceFormat(this.params.sortingOrderTotal)
            })
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            submit() {
                var o = {
                    id: this.params.id,
                    payType: this.payType,
                    payTotal: this.form.total.mul(100)
                }
                this._updateOrder(o)
                    .then((function(d) {
                        this.$message({
                            type: 'success',
                            message: '操作完成'
                        });
                        this.$emit('submit')
                    }).bind(this))
            },       
		}
	}
</script>