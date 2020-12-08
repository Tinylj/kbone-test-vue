import Vue from "vue";
//resize刷新效果,窗体事件，在切换路由的过程中会被清除掉
window.resizeFunctions = [];
//resize刷新效果,窗体事件，在切换路由的过程中不会被清除，但是可以被替换，按名字来，最好是按功能名字。
if (typeof window.resizeFunctionsConst == "undefined") {
    window.resizeFunctionsConst = [];
}
window.onresize = function () {
    for (let i = 0; i < window.resizeFunctions.length; i++) {
        const copy_f = window.resizeFunctions[i].callback;
        if (typeof copy_f == "function") {
            copy_f();
        }
    }
    for (let i = 0; i < window.resizeFunctionsConst.length; i++) {
        const item = window.resizeFunctionsConst[i];
        const copy_c = item.callback;
        if (typeof copy_c == "function") {
            if (item.name == "feComponent") {
                copy_c();
            } else {
                const hash = window.location.hash;
                let route = "";
                if (hash.indexOf("?") === -1) {
                    route = hash.match(/#(\S*)/)[1];
                } else {
                    route = hash.match(/\#(.+?)\?/)[1];
                }
                if (item.route == null || item.route === route) {
                    copy_c();
                }
            }
        }
    }
};
//添加resizeFunctionsConst 需要在这里添加，不要直接添加值
//type 为:normal和const,normal是常规,const 是不会被清除，但是可以被替换，callback是回调函数
//对应到子页面就是 keep-alive:true 的应该是const,keep-alive:false的 为normal
// route:对应页面的路由，只会执行当前页面的事件集。默认为null，此类事件会一直执行，与当前路由无关
Vue.prototype.addResizeFunctions = function (option) {
    const type = option.type;
    const name = option.name;
    const callback = option.callback;
    const route = option.route;
    if (type == "const") {
        let doRepeat = false; //没有重名的
        let repeatIndex = 0;
        for (let i = 0; i < window.resizeFunctionsConst.length; i++) {
            const copy_c = window.resizeFunctionsConst[i];
            if (copy_c.name == name) {
                doRepeat = true;
                repeatIndex = i;
            }
        }
        if (doRepeat) {
            window.resizeFunctionsConst.splice(repeatIndex, 1);
        }
        window.resizeFunctionsConst.push({
            name: name,
            callback: callback,
            route: route
        });
    } else {
        window.resizeFunctions.push({
            name: name,
            callback: callback
        });
    }
};
//参数序列化
Vue.prototype.returnStr = param => {
    let rstr = "";
    let isOne = true;
    for (const a in param) {
        if (isOne) {
            rstr = rstr + a + "=" + encodeURIComponent(param[a]);
        } else {
            rstr = rstr + "&" + a + "=" + encodeURIComponent(param[a]);
        }
        isOne = false;
    }
    return rstr;
};
//违法输入字符集
const invalidStr = [
    "script>",
    "<style",
    "onerror=",
    "<img",
    "<iframe",
    "<alert",
    "<body",
    "alert(",
    "<bgsound",
    "<link",
    "<meta",
    "<frameset",
    "<table",
    "<xss",
    "exppression(",
    "<base",
    "<embed",
    "xmlns:xss",
    "href="
];
Vue.prototype.verification = value => {
    let backvalue = true;
    for (const a in value) {
        if (typeof value[a] == "string") {
            const testvalue = value[a].trim().toLowerCase();
            for (let i = 0; i < invalidStr.length; i++) {
                if (testvalue.indexOf(invalidStr[i]) != -1) {
                    backvalue = false;
                    break;
                }
            }
        }
    }
    return true;
};

