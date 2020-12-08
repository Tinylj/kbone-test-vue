const redirectUrl = require("./redirectUrl.js").default;
const svcPath = redirectUrl.apiBase + "/auth";
const api = {
	login: {
		loginNew: svcPath + "/login/passport", // 登录
		forgetpwd:svcPath + "/login/forgetpwd",//忘记密码
		checkSmsCode:svcPath + "/login/checkSmsCode",//验证一下 验证码 是不是对的
		getNewPwd:svcPath + "/login/getNewPwd",// 修改密码
		sendPlaceCheck:svcPath + "/login/sendPlaceCheck",//异地登录发送手机验证码
		loginContinue:svcPath + "/login/loginContinue",//异地登录-继续验证登录
		logout:svcPath + "/logout",//登出接口
	},
	trial: {
		apply: svcPath + "/trial/apply", // 登录
        etPlatList: svcPath + "/trial/getPlatList"//获取选择试用系统列表
	},
	sysUser: {
		checklogin: svcPath + "/sysUser/checklogin",//检查是否登录
	}
};
export {api,redirectUrl};
