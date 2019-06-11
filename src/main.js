import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//引入VueRouter
import VueRouter from "vue-router"
Vue.use(VueRouter)
// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI, { size: 'mini' })

// 自定义样式
import './scss/custom.scss'
import './scss/overwrite.scss'
// 语法插件
import 'babel-polyfill'
// 自定义组件
import components from './components/index.js'
Vue.use(components)

//路由、全局状态
import routes from './router.js';
import stores from './store.js';
const router = new VueRouter({routes})
const store = new Vuex.Store(stores)
import local from './local.js'

//记录停留的页面时间
var stopPageTime;
var referrer = getReferrer();

//图片查看 放大缩小
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
Viewer.setDefaults({
    Options: {"inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" ,"zIndexInline": 3000}
});

// 全局路由拦截
router.beforeEach((to, from, next) => {
	
	if(stopPageTime){
		clearTimeout(stopPageTime)
	}
	//刷新的时候name为空
	if(from.name&&to.name!=store.state.recordObj.name){
		store.state.recordObj.pageColseDate=moment().format('YYYY-MM-DD HH:mm:ss');
		var o={};
		Object.assign(o,store.state.recordObj)
		store.state.recordArr.push(o)
		store.state.recordObj.time=0
		store.state.recordObj.record=[]
		console.log(store.state.recordArr)
	}
	
    NProgress.start();
    window.scroll(0, 0);
    var user = local.get('userinfo')
    var navlist = local.get('navlist')
    if(!user || !user.loginName) {        
        if(to.path !== '/login' && to.path !== '/customerRegist'&& to.path !== '/complementingInformation' && to.path !== '/registerNewtwo') {
            NProgress.done();
            next('/login');   
        }else {
            next()        
        }
    }else{
        if(to.name !== 'login' && to.name !== 'customerRegist'&& to.name !== 'complementingInformation' && to.name !== 'registerNewtwo' && to.name !== 'index' && to.name !== 'index_index' && !to.meta.modal) {
            forNavList(navlist, to.name, next)
        }else {
            next()
        }
    }	
});
//transition
router.afterEach( (to, from) => {
    NProgress.done();
    //停留时间计算
    setTimeout(function fn(){
    	store.state.recordObj.time++
    	stopPageTime=setTimeout(fn,1000)
    },1000)
    
    //进入页面的时间
    store.state.recordObj.pageStartDate=moment().format('YYYY-MM-DD HH:mm:ss')
    //第一次进来的地址
    store.state.recordObj.url=referrer+'#'+to.path
    store.state.recordObj.name=to.name
    store.state.recordObj.meta=to.meta
});
// 标签名
var title = '商户系统'
document.title = title


//页面刷新
window.onbeforeunload = function() {
	store.state.recordObj.pageColseDate=moment().format('YYYY-MM-DD HH:mm:ss');
	var o={};
	Object.assign(o,store.state.recordObj)
	store.state.recordArr.push(o)
	localStorage.setItem('jz_record',JSON.stringify(store.state.recordArr))
};

//获取监听事件
	console.log(document.getElementById('app'))
// 定义全局点击函数
Vue.prototype.globalClick = function (callback) {
	console.log(document.getElementById('main'))
    document.getElementById('main').onclick = function (e) {
    	
        callback(e);
    };
}


function getReferrer() {
    var referrer = '';
    try {
        referrer = window.top.document.referrer;
    } catch(e) {
        if(window.parent) {
            try {
                referrer = window.parent.document.referrer;
            } catch(e2) {
                referrer = '';
            }
        }
    }
    if(referrer === '') {
        referrer = document.referrer;
    }
    return referrer;
}


// 解决前端计算精度问题
Number.prototype.add = function (arg) {
    return accAdd(this, arg);
};
Number.prototype.sub = function (arg) {
    return accSub(this, arg);
};
Number.prototype.mul = function (arg) {
    return accMul(this, arg);
};
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};

String.prototype.add = function (arg) {
    return accAdd(this, arg);
};
String.prototype.sub = function (arg) {
    return accSub(this, arg);
};
String.prototype.mul = function (arg) {
    return accMul(this, arg);
};
String.prototype.div = function (arg) {
    return accDiv(this, arg);
};

// toFixed兼容方法
Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    const number = this;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    let result = number.toString();
    const arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (let i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    const integer = arr[0];
    const decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }

    return result;
};

// render
import App from './App.vue'
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

console.log(accAdd(2.3,1.15))
console.log(accAdd(114.00,1.00))
function accAdd(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    console.log(r1)
    console.log(r2)
    c = Math.abs(r1 - r2);
    console.log(c)
    console.log(arg1,arg2)
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
        	console.log('250',Number(arg1.toString().replace(".", "")))
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    console.log(arg1,arg2,m)
    return (arg1 + arg2) / m;
}
function accSub(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return (arg1 * m - arg2 * m) / m
}
function accMul(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
function accDiv(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

function forNavList(navlist, name, next) {
    navlist.forEach(function(el) {
        if(el.caption == name) {
            next()
        }else {
            if(el.hasChildren === 1) {
                forNavList(el.children, name, next)
            }
        }
    })
}

import VueQr from 'vue'
import VueQriously from 'vue-qriously'
VueQr.use(VueQriously)















