<template>
	<el-dialog custom-class="jz-modal" title="分配车辆" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="1500px">
		<!--送货单号，买方名称，配送时间，商圈编号-->
		<searchInputItems>
			<searchInputItem name="送货单号">
				<inputItem :value.sync="searchForm.orderNumber" placeHolder="请输入送货单号"></inputItem>
			</searchInputItem>
			<searchInputItem name="买方名称">
				<inputItem :value.sync="searchForm.buyerName" placeHolder="请输入买方名称"></inputItem>
			</searchInputItem>
			<searchInputItem name="商圈编号">
				<!--<selectInput :clearable='true' :value.sync="searchForm.storageId" @selectChange="searchTable">
					<el-option
				      v-for="item in storageList"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</selectInput>-->
				<inputItem :value.sync="searchForm.buyerBusinessNo" placeHolder="请输入买方商圈序号"></inputItem>
			</searchInputItem>
			<searchInputItem name="配送时间">
				<dateEditorDaterange :dateValue.sync="dateRange" ></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="130px">
            <el-row>
		        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		            <el-form-item label="分配车辆车牌号" prop="vehicleNo">
						<el-select v-model="form.vehicleId" placeholder="请选择">
							<el-option v-for="item in vehicleNoList" :key="item.id" :label="item.vehicleNo" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :showPagination="true" :maxHeight="modalMaxTableHeight">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderUmber" label="送货单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<div>{{scope.row.orderUmber}}</div>
					</toolTip>
				</template>
			</el-table-column>
            <el-table-column prop="buyerBusinessNo" label="买家商圈序号" width="280">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerBusinessNo">
						<div>{{scope.row.buyerBusinessNo}}</div>
					</toolTip>
				</template>
			</el-table-column>
          	<el-table-column prop="buyerName" label="买家名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<div>{{scope.row.buyerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
      		<el-table-column prop="distributionTime" label="预计送达时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.distributionTime">
						<div >{{scope.row.distributionTime}}</div>
					</toolTip>
				</template>
			</el-table-column>
      		<el-table-column prop="orderDate" label="订单时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderDate">
						<div >{{scope.row.orderDate}}</div>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
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
      dataList: [],
      form:{
          vehicleId:""
      },
      vehicleNoList:[],
      searchForm:{
      	userId:parseInt(local.get("sessionUser").typeCode||0),
      	orderNumber: '',
      	buyerName: '',
      	buyerBusinessNo: '',
      	startDate: '',
      	endDate: '',
      },
      dateRange: [],
      orderList: [],
    };
  },
  props: {
    modal: {
      default: false
    },
    tableCarRow: {
      default: function() {
        return {};
      }
    }
  },
  mounted() {
      //console.log('对象',this.tableCarRow);
      this.dateRange[0] = this.getToday;
      this.dateRange[1] = this.getToday;
      this.searchTable();
      this.searchVehicleNo();
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    searchTable() {
    	let startDate = '';
    	let endDate = '';
    	if(this.dateRange != null && this.dateRange.length > 0) {
    		startDate = this.dateRange[0] + " 00:00:00";
    		endDate = this.dateRange[1] + " 23:59:59";
    	} 
    	Object.assign(this.searchForm, {
			startDate : startDate,
			endDate : endDate,
		});
		this._ajax({
		    url: this.distributeAPI + "deliveryOrder/GetUndistributeOrder",
			name: "",
		    param: this.searchForm
		}).then((function(d){
			this.orderList = d.aaData
			this.dataList = this.orderList.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);;
			this.pageTotal = this.orderList.length;
		}).bind(this));
    },
    beforeClose(done) {
      this.cancel();
    },
    submit(){
       if(this.form.vehicleId==""){
        this.$message({ type: "info", message: "请选择车辆" });
      }
      else if (this.delSelection.length === 0) {
        this.$message({ type: "info", message: "请选择行" });
      } else {
        let selection = this.delSelection;
        var arr = [],
          o = {};
        selection.forEach(function(el) {
          arr.push(el.id);
        });
        o.orderIds = arr.join(',');
        this.save(o);
      }
    },
    save(o){
      var sf=this;
      o.vehicleId=this.form.vehicleId;
      let user = local.get("sessionUser");
      o.distributorId = parseInt(user.typeCode||0);
      o.operator=user.loginName;
//    console.log(o);
      this._ajax({
        url: this.distributeAPI+"distributionOrder/CreatDistributeOrder",
        name: "",
        param: o,
        loading: "dataLoading"
      }).then(d=>{
          if (d.state == 0) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              sf.cancel();
              sf.$emit("refreshtable");
            } else {
              this.$message({
                type: "failure",
                message: d.msg
              });
            }
      });
    },
    searchVehicleNo(){
        let user = local.get("sessionUser");
        let pa={
            customerId:parseInt(user.typeCode||0),
            vehicleStatus:0,
			enabled:1,
			deleted:1
        };
        this._ajax({
        url: this.distributeAPI+"baseVehicle/list",
        name: "",
        param: pa
      }).then(d=>{
          this.vehicleNoList=d.aaData;
          if (this.vehicleNoList.length>0){
             this.form.vehicleId=this.vehicleNoList[0].id;
          }
      });
    },
    reset() {
      Object.assign(this.searchForm, {
        userId:parseInt(local.get("sessionUser").typeCode||0),
      	orderNumber: '',
      	buyerName: '',
      	buyerBusinessNo: '',
      	startDate: '',
      	endDate: '',
      });
      this.dateRange = []
      this.searchTable()
    },
  }
};
</script>