<template>
	<el-dialog custom-class="jz-modal" :title="ModalType === 'add' ? '新增称重筐' : '编辑称重筐'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form"  :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="称重筐名称" prop='name'>
						<inputItem :value.sync="form.name" maxlength="20"></inputItem>
					</el-form-item>
				</el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="称重筐重量" prop="weight">
						<inputItem :value.sync="form.weight" maxlength="10"></inputItem><span>&nbsp;千克</span>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="称重筐押金"  prop='deposit'>
						<inputItem :value.sync="form.deposit" maxlength="5"></inputItem><span>&nbsp;元</span>
					</el-form-item>
				</el-col>
			</el-row>			
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" >取消</elBtn>
			<elBtn @click="submit" type="primary">提交</elBtn>
		</div>
	</el-dialog>
</template>
<script>
import local from "../../local.js";
import mixin from "../../mixin/mixin.js";
import configs from "../../configs.js";
export default {
  mixins: [mixin],
  data() {
    return {
      form: {
        name: "",
        weight: "",
        deposit:0,
      },
	  weightFloat:/^([1-9]{1,4})(\.[0-9]{1,2})?$/,
      typeCode: "",
      rules: {
        name: [
          {
            required: true,
            message: "称重筐名称不能为空"
          },
          this._ruleLength(50)
        ],
        weight: [
          {
            required: true,
            message: "重量不能为空"
          },
          this.regWeight()
        ],
        deposit: [          
          this._rulePosPattern(),
          {validator: function(rule, value, callback) {
            if(value > 10000) {
              callback(new Error('押金小于10000'))
            } else {
              callback();
            }
          }},
        ]
      }
    };
  },
  props: {
    modal: {
      default: false
    },
    tableRow: {
      default: function() {
        return {};
      }
    },
    ModalType: {
      default: "add"
    }
  },
  mounted() {
    if (this.ModalType != "add") {
      Object.assign(this.form, this.tableRow);
    }
    console.log(this.form)
  },
  methods: {
  	regWeight(){	
			return {
				validator: (function(rule, value, callback) {
					var val = $.trim(value)
					if(val == 0 || !this.priceFloat.test(val)) {
		              callback(new Error('请输入大于0的数字，小数位数不超过两位'))
		            } else {
		              callback();
		            }
				}.bind(this)), trigger: 'blur'
			}
	},
    cancel() {
      this.$emit("close");
    },
    submit() {
      let user = local.get("sessionUser");
      //this.searchForm.typeCode = user.typeCode
      /**customerid  需要从缓存中获取 */

      this.$refs["form"].validate(valid => {
        if (valid) {
          var o = {
            id: this.tableRow.id || null,
            name: this.form.name,
            weight: this.form.weight,
            deposit:this.form.deposit,
            customerId: parseInt(user.typeCode || 0)
          };
          this.$emit("add", o);
          this.cancel();
        } else {
          return false;
        }
      });
    },
    beforeClose(done) {
      this.cancel();
      done();
    }
  }
};
</script>