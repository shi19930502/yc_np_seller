import _ from 'lodash'
/**
 * 加法，无精确度，如果传字符串类型则返回拼接后的值
 */
function add(a, b) {
	return _.add(a, b)
}
/**
 * 加法，四舍五入，默认精确度为2
 */
function addRound(a, b, precision) {
	return addPrecs(a, b, {precs: precision})
}
/**
 * 加法，自定义处理方式和精确度
 */
function addPrecs(a, b, {
			precs = 2,
			type = 'round'
		} = {}) {
	try {
		var res = mathType(add(a, b), precs, {
			type: type
		})
		return isNaN(res) ? add(a, b) : res
	}catch(err) {
		return add(a, b)
	}
}
/**
 * 减法，无精确度
 */
function subtract(a, b) {
	return _.subtract(a, b)
}
/**
 * 减法，四舍五入，默认精确度为2
 */
function subtractRound(a, b, precision) {
	return subtractPrecs(a, b, {precs: precision})			
}
/**
 * 减法，自定义处理方式和精确度
 */
function subtractPrecs(a, b, {
	precs = 2,
	type = 'round'
} = {}) {
	try {
		var res = mathType(subtract(a, b), precs, {
			type: type
		})
		return isNaN(res) ? subtract(a, b) : res
	}catch(err) {
		return subtract(a, b)
	}				
}	
/**
 * 乘法，无精确度
 */
function multiply(a, b) {
	return _.multiply(a, b)
}
/**
 * 乘法，四舍五入，默认精确度为2
 */
function multiplyRound(a, b, precision) {
	return multiplyPrecs(a, b, {precs: precision})					
}
/**
 * 乘法，自定义处理方式和精确度
 */
function multiplyPrecs(a, b, {
	precs = 2,
	type = 'round'
} = {}) {
	try {
		var res = mathType(multiply(a, b), precs, {
			type: type
		})
		return isNaN(res) ? multiply(a, b) : res
	}catch(err) {
		return multiply(a, b)
	}				
}
/**
 * 除法，无精确度
 */
function divide(a, b) {
	return _.divide(a, b)
}
/**
 * 除法，四舍五入，默认精确度为2
 */
function divideRound(a, b, precision) {
	return dividePrecs(a, b, {precs: precision})			
}
/**
 * 除法，自定义处理方式和精确度
 */
function dividePrecs(a, b, {
	precs = 2,
	type = 'round'
} = {}) {
	try {
		var res = mathType(divide(a, b), precs, {
			type: type
		})
		return isNaN(res) ? divide(a, b) : res
	}catch(err) {
		return divide(a, b)
	}				
}
/**
 * 四舍五入，默认精确度为2
 */
function round(val, precision) {
	return mathType(val, precision)
}
/**
 * 向下取整，默认精确度为2
 */
function floor(val, precision) {
	return mathType(val, precision, {
		type: 'floor'
	})
}
/**
 * 向上取整，默认精确度为2
 */
function ceil(val, precision) {
	return mathType(val, precision, {
		type: 'ceil'
	})
}
function toInteger(val) {
	return _.toInteger(val)
}
function toNumber(val) {
	return _.toNumber(val)
}
function isNaN(val) {
	return _.isNaN(val)
}

/**
 * floor、round、ceil，默认精确度为2
 */
function mathType(val, precision, {
						type = 'round'
					} = {}) {
						precision = precision == null ? 2 : Math.min(toInteger(precision), 292);
						return _[type](val, precision)
					}
export {
	add,
	addRound,
	addPrecs,
	subtract,
	subtractRound,
	subtractPrecs,
	multiply,
	multiplyRound,
	multiplyPrecs,
	divide,
	divideRound,
	dividePrecs,
	round,
	floor,
	ceil,
	toInteger,
	toNumber,
	isNaN
}
