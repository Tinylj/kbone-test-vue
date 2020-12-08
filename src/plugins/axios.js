import axios from "axios";
import Vue from "vue";
import router from "../router";
import store from "../store";

axios.defaults.withCredentials = true; //请求头跨域
axios.defaults.timeout = 50000; //请求超时（毫秒）
//响应拦截器即异常处理
axios.interceptors.response.use(response => {
	Vue.prototype.$lhLoading.hide();
	if (response.data.code == "2007" || response.data.code == "6020" || response.data.code == "6019" || response.data.code == "6023") {
		if (window.location.hostname == "localhost") {
			router.push("/login");
		}
		else {
			window.location.href = (store.state.redirectUrl.login + "?redirectUrl=" + window.location.href);
		}
		return response;
	}
	// tomcat报错，报错sql、代码运行报错
	else if (response.data.code == "7000") {
		console.log(response.data.message);

	} else {
		return response;
	}
}, err => {
	// 去除loading遮罩
	Vue.prototype.$lhLoading.hide();
	if (err && err.response) {
		console.log(err);
		return;
	} else {
		//Todo something
	}
	return Promise.resolve(err.response);
});


//get请求 res => res.data 极简箭头函数，其实相当于 function(res){return res.data}
// export const get = (url,params) => { return axios.get(url, { params: params }).then(res => res.data); };
Vue.prototype.ajaxGet = (url, params) => {
	const cando = Vue.prototype.verification(params);
	if (!cando) {
		return;
	}
	//加个时间戳，IE有缓存ajax的习惯
	const myfunc = axios.get(url + '?timeStamp=' + new Date().getTime(), {params: params}).then(res => {
		if (typeof res == "undefined") {
			//后端不返回消息的时候，主动构建一个
			console.log("接口" + url + "报错");
			res = {
				data: {
					code: "99999",
					message: "接口超时，请重试",
				}
			};
		}
		return res.data;
	});
	return myfunc;
};
//post 请求,request-param版
Vue.prototype.ajaxPost = (data) => {
	// {
	//     url:"",//地址
	//     type:1, //类型
	//     params:"",//请求参数
	//     handSelf //错误事件自己处理
	// }


	const cando = Vue.prototype.verification(data.params);
	if (!cando) {
		return;
	}
	let myfunc = "";
	const mytype = data.type || 1;
	const handSelf = data.handSelf || false;
	switch (mytype) {
		case 1:
			//application/x-www-form-urlencoded 默认Content-Type
			myfunc = axios.post(data.url, Vue.prototype.returnStr(data.params)).then(res => {
				if (typeof res == "undefined") {
					//后端不返回消息的时候，主动构建一个
					console.log("接口" + data.url + "报错");
					res = {
						data: {
							code: "99999",
							message: "接口超时，请重试",
						}
					};
				}
				return res.data;
			});
			break;
		case 2:
			//application/json  Content-Type
			myfunc = axios({
				url: data.url,
				data: data.params,
				method: 'post',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(res => {
				if (typeof res == "undefined") {
					//后端不返回消息的时候，主动构建一个
					console.log("接口" + data.url + "报错");
					res = {
						data: {
							code: "99999",
							message: "接口超时，请重试",
						}
					};
				}
				return res.data;
			});
			break;
		case 3:

			//multipart/form-data Content-Type
			myfunc = axios({
				url: data.url,
				data: data.params,
				method: 'post',
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(res => {
				if (typeof res == "undefined") {
					//后端不返回消息的时候，主动构建一个
					console.log("接口" + data.url + "报错");
					res = {
						data: {
							code: "99999",
							message: "接口超时，请重试",
						}
					};
				}
				return res.data;
			});
			break;
		case 4:
			// responseType: 'blob'
			// 接收文件流下载用
			myfunc = axios({
				url: data.url,
				data: data.params,
				method: 'post',
				responseType: 'blob',
			}).then(res => {
				if (typeof res == "undefined") {
					//后端不返回消息的时候，主动构建一个
					console.log("接口" + data.url + "报错");
					res = {
						data: {
							code: "99999",
							message: "接口超时，请重试",
						}
					};
				}
				return res.data;
			});
			break;
		default:
			break;
	}
	return myfunc;
};
