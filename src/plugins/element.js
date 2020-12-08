import 'element-ui/lib/theme-chalk/index.css';// 默认主题
import './element-ui-reset.css';
import ElementUI from 'element-ui';
import Vue from "vue";
Vue.use(ElementUI, {size: 'small'});

// 修改element-ui的loading组件
Vue.prototype.lujLoading = "";
Vue.prototype.$lhLoading = {
	show: (option) => {
		if (typeof option == "undefined") {
			option = {
				lock: true,
				text: '努力加载中...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			};
		}
		Vue.prototype.lujLoading = Vue.prototype.$loading(option);
	},
	hide: () => {
		if (Vue.prototype.lujLoading != "") {
			Vue.prototype.lujLoading.close();
		}
	}
};


// 修改element-ui的message提示框
const msg = {
	default: {
		// 默认配置
		duration: 1000, //弹窗消失时间
		showClose: true //是否显示关闭按钮
	},
	initOption(option) {
		// 初始化配置
		let realOption = {};
		if ((typeof option == 'string') && option.constructor == String || (typeof option == 'number') && option.constructor == Number) {
			// 传参为字符串或者数字
			realOption = {...this.default, ...{message: option}};
		} else if ((typeof option == 'object') && option.constructor == Object) {
			// 传参为对象
			realOption = {...this.default, ...option};
		} else {
			return false;
		}
		return realOption;
	},
	error(option) {
		const realOption = this.initOption(option);
		if (realOption) {
			Vue.prototype.$message.error(realOption);
		}
	},
	info(option) {
		const realOption = this.initOption(option);
		if (realOption) {
			Vue.prototype.$message.info(realOption);
		}
	},
	success(option) {
		const realOption = this.initOption(option);
		if (realOption) {
			Vue.prototype.$message.success(realOption);
		}
	},
	warning(option) {
		const realOption = this.initOption(option);
		if (realOption) {
			Vue.prototype.$message.warning(realOption);
		}
	}
};
const message = function (option) {
	const realOption = msg.initOption(option);
	if (realOption) {
		Vue.prototype.$message(realOption);
	}
};
Object.assign(message, msg);
Vue.prototype.$msg = message;
