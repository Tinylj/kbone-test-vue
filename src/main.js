import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js';
import './plugins/lhui.js';
import './plugins/axios.js';

import store from './store'
import VueCookie from 'vue-cookie';
Vue.use(VueCookie);



require("./utils/common_util.js");
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
