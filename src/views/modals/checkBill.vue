<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
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
                default: '确认收款金额'
            },
            params: {
                default: function() {
                    return {}
                }
            },
            state: {
                default: ''
            }
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
                    paymentStatusId: '1',
                    orderStatusId: this.state,
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