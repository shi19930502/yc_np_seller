import local from './local.js'
import configs from './configs.js'
async function ajax({
	            url = configs.rootAPI,
	            type = 'POST',
	            name = '',
	            param = {},
	            async = true,
	            loading = '',
	            jsonType = false,
	            arr = false,
	            valiToken = true,
	            withCredentials = false
	        } = {}) {
    let contentType = jsonType ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    let token = local.get('token')
    for (var key in param) {
        if (typeof param[key] === 'string') {
            param[key] = $.trim(param[key].replace(/<\/?[^>]*>/g, ''))
        }
    }
    param.token = token
    if ((url === configs.rootAPI || url === configs.userAPI) && name !== '') {
    	url = url + name
    }
    let o = {
        url: url,
        type: type,
        data: param,
        async: async,
        contentType: contentType
    }
    if(withCredentials) {
        o.xhrFields = {
            withCredentials: true
        }
    }
    let data = {}
    if (arr) {
        o.traditional = true
    }
    try {
    	data = await $.ajax(o)
    			  .then(function(d) {
    			  	return d
    			  })
    			  .fail(function(d) {
    			  	return d
    			  })
    }catch(err) {
    	data = {}
    }    
    return data
}
export default ajax