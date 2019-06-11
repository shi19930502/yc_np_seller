export default {
    data() {
        return {}
    },
    methods: {
        generateSuyuanHtml(o) {
            return `<div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
						商家编号:
						<span style="font-weight: bolder;font-size: 15px;padding-left:30px;">${o.customerIndex}</span>
						<span style="font-weight: bolder;font-size: 15px;padding-left:10px;">${o.extendIndex}</span>
						</div>
						<div style="font-size: 13px;height: 20px;line-height: 20px;">商家:${o.buyerName}</div>
						<div style="font-size: 13px;height: 20px;line-height: 20px;">商品:${o.productName}</div>
						<div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:${o.sortingWeight}</div>
						<div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:</div>
						<div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">${o.date}</div>
					<div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">${o.city}</div>
					`
        },
    },
}