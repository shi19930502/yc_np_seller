export default {
	data(){
		return{	

		}
	},
	methods: {
		/**
		 * [_createOrder 生成主订单及订单明细]
		 * @param  {[type]} o [description]
		 * @return {[type]}   [description]
		 */
		_createOrder(o) {
			if(o.submitLoading) {
				return this._ajax({name: 'order/orderCreateByMerchant', param: o, loading: 'submitLoading'})
			}else {
				return this._ajax({name: 'order/orderCreateByMerchant', param: o})
			}			
		},
		/**
		 * [批量更新订单状态]
		 * @param  {[arr]} ids   [订单ids]
		 * @param  {[string]} state [订单状态]
		 * @return {[promise]}       [description]
		 */
		_batchUpdateOrderState(ids, state, loading) {
			if(loading){
				return this._ajax({name: 'order/orderStateUpdate', param: {id: ids, state: state}, arr:true, loading: loading})
			}else {
				return this._ajax({name: 'order/orderStateUpdate', param: {id: ids, state: state}, arr:true})
			}			
		},
		/**
		 * [_batchUpdateOrderState description]
		 * @return {[type]} [description]
		 */
		_batchUpdateOrderStates(ids, order, loading) {
			var o = {}
			Object.assign(o, {
				orderId: ids
			}, order)
			if(loading){
				return this._ajax({name: 'order/batchOrderStateUpdate', param: o, arr:true, loading: loading})
			}else {
				return this._ajax({name: 'order/batchOrderStateUpdate', param: o, arr:true})
			}		
		},
		/**
		 * [修改主订单]
		 * @param  {[Object]} order [主订单对象]
		 * @return {[type]}       [description]
		 */
		_updateOrder(order, loading) {
			if(loading) {
				return this._ajax({name: 'order/update', param: order, loading: loading})
			}else {
				return this._ajax({name: 'order/update', param: order})
			}
			
		},
		/**
		 * [修改配送单]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		_updateDistributionOrder(id) {
			return this._ajax({name: 'order/updateDistributionOrder', param: {orderId: id}})
		},
		/**
		 * [批量修改子订单记录]
		 * @param  {[arr]} items [子订单数组]
		 * @return {[type]}    [description]
		 */
		_batchUpdateOrderItem(items, orderStatusId) {
			var arr = [];
			items.forEach(function(el) {
				// var o = Object.assign(el, {
				// 	oriPrice: el.oriPrice * 100,
    //                 price: el.price * 100,
    //                 itemTotal: el.itemTotal * 100,
    //                 sortingTotal: el.sortingTotal * 100,
    //                 inspectedTotal: el.inspectedTotal * 100
				// })	
				var o = {};
				Object.assign(o, el);
				Object.assign(o, {
					oriPrice: o.oriPriceForDecimal === null ? '' : o.oriPriceForDecimal.mul(100),
                    price: o.priceForDecimal === null ? '' : o.priceForDecimal.mul(100),
                    itemTotal: o.itemTotal === null ? '' : o.itemTotal.mul(100),
                    sortingTotal: o.sortingTotal === null ? '' : o.sortingTotal.mul(100),
                    inspectedTotal: o.inspectedTotal === null ? '' : o.inspectedTotal.mul(100)
				});
				arr.push(o)
			});
			return this._ajax({name: 'orderitem/batchUpdate', param: {orderitems: JSON.stringify(arr), curStates: orderStatusId}, arr:true})
		},
		/**
		 * [_bathDeleteOrderItem 批量删除子订单记录]
		 * @param  {[arr]} ids [子订单ids]
		 * * @param  {[int]} orderid [主订单id]
		 * @return {[type]}     [description]
		 */
		_bathDeleteOrderItem(ids, orderid) {
			return this._ajax({name: 'orderitem/deleteItemsOrder', param: {id: ids, orderid: orderid}, arr:true})
					   .then((function(d) {
					   		if(d.state === 0) {
					   			this.$message({type: 'success', message: '操作完成'})
					   		}else {
					   			this.$message({type: 'warning', message: d.msg})
					   		}
					   		return d
					   }).bind(this))
		},
		/**
		 * [_createStock 生成出库单及明细]
		 * @param  {[type]} stock        [description]
		 * @param  {[type]} stockDetails [description]
		 * @return {[type]}              [description]
		 */
		_saveStock(stock, stockDetails) {
			Object.assign(stock, {
				inoutDetailList: JSON.stringify(stockDetails)
			});
			return this._ajax({name: 'inoutstock/save', param: stock})
		},
		/**
		 * [_bathSaveStock 批量提交出入库单]
		 * @param  {[type]} stockId [description]
		 * @return {[type]}         [description]
		 */
		_bathSaveStock(stockId) {
			return this._ajax({name: 'inoutstock/submit', param: {stockId}, arr:true})
		},
		/**
		 * [_saveProCategory 查询分类列表包含级联数据]
		 * @return {[type]} [description]
		 */
		_saveProCategory() {
	        return this._ajax({name: 'category/childList', param: {parentCategoryId: 'top', filteEnabled: 1, filteDeleted: 0}})
	        .then((function(d) {
	          this.$store.dispatch('categoryList', d.aaData)
	        }).bind(this))
      	},
      	/**
      	 * [_customerById description]
      	 * @param  {[type]} id [description]
      	 * @return {[type]}    [description]
      	 */
      	_customerById(id) {
      		return this._ajax({name: 'customer/list', param: {id}})
      	},
        /**
		 * 保存进场主表和明细表信息
		 *
         * @param main 主表
         * @param inMarketDetails 明细[数组]
         * @returns {*}
         * @private
         */
        _saveInMarket(main, inMarketDetails) {
            Object.assign(main, {
                inmarketdetailList: JSON.stringify(inMarketDetails)
            });
            return this._ajax({name: 'inmarketmain/save', param: main})
        },
        /**
         * 出入库单批量删除
         * @param  {[type]} ids [description]
         * @return {[type]}     [description]
         */
        _bathDelStock(ids) {
        	return this._ajax({name: 'inoutstock/deleteDraftByIds', param: {id: ids}, arr:true})
        },
        /**
         * 皮脸删除盘点
         * @param  {[type]} ids [description]
         * @return {[type]}     [description]
         */
        _bathDelInventory(ids) {
        	return this._ajax({name: 'productstockinventory/deleteDraftByIds', param: {id: ids}, arr:true})
        }
	}
}