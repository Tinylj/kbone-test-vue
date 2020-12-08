import Vue from 'vue'
import Vuex from 'vuex'
import {api,redirectUrl} from './api.js';
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headerTips: 'hello',
    lhInterface: api,
    redirectUrl: redirectUrl,
    input: '',
  },
  actions,
  mutations,
})
