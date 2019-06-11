export default {
	data(){
		return{	
			dataList: [],
			dataLoading: false,
			csvDataList: [],
			rowSelection: [],
			delSelection: [],
			selectedRows: [],
            tmpSelectRows: [],
            selectedRowKey: 'id',
            selectedRowName: 'name',
            dataListName: 'dataList'
		}
	},
	methods: {
		selectionChangeTag(val) {
            var curSelectedRows = [], curUnSelectedRows = []
            curSelectedRows = val
            this[this.dataListName].forEach((function(el) {
                var flag = true
                curSelectedRows.forEach((function(em) {
                    if(el[this.selectedRowKey] === em[this.selectedRowKey]) {
                        flag = false
                    }
                }).bind(this))
                if(flag) {
                    curUnSelectedRows.push(el)
                }
            }).bind(this))
            var arr = this.selectedRows
            curSelectedRows.forEach((function(el) {
                var flag = true
                this.selectedRows.forEach((function(em) {
                    if(el[this.selectedRowKey] === em[this.selectedRowKey]) {
                        flag = false
                    }
                }).bind(this))
                if(flag) {
                    arr.push(el)
                }
            }).bind(this))
            var arr2 = []
            arr.forEach((function(el) {
                var flag = true
                curUnSelectedRows.forEach((function(em) {
                    if(el[this.selectedRowKey] === em[this.selectedRowKey]) {
                        flag = false
                    }
                }).bind(this))
                if(flag) {
                    arr2.push(el)
                }
            }).bind(this))
            this.selectedRows = arr2
        },
        handleSelectedDelTag(item) {
            var arr = []
            this.selectedRows.forEach((function(el) {
                if(item[this.selectedRowKey] !== el[this.selectedRowKey]) {
                    arr.push(el)
                }
            }).bind(this))
            this.tmpSelectRows = arr
            this.renderTableSelectedTag()
            this.selectedRows = arr
        }, 
        renderTableSelectedTag() {
            this[this.dataListName].forEach((function(el) {
                var flag = true
                this.tmpSelectRows.forEach((function(em) {
                    if(el[this.selectedRowKey] === em[this.selectedRowKey]) {
                        this.$refs['tableTag'].$refs['multipleTable'].toggleRowSelection(el, true)
                        flag = false
                    }
                }).bind(this))
                if(flag) {
                    this.$refs['tableTag'].$refs['multipleTable'].toggleRowSelection(el, false)
                }
            }).bind(this)) 
            this.tmpSelectRows = []             
        },
		selectionChange(val) {
			this.rowSelection = val
			this.delSelection = val
		},
		rowEdit() {

		},
		submitEdit() {

		},
		cancelEdit() {

		},
		delRow() {
			
		},
		selectChange(val) {
							
		},
		handleSizeChangeTag(val) {
            this.tmpSelectRows = this.selectedRows
            this.handleSizeChange(val)
        },
        handleCurrentChangeTag(val) {
            this.tmpSelectRows = this.selectedRows
            this.handleCurrentChange(val)
        },
	},
}