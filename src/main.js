import Vue from 'vue'
import store from '@/store';
import Pagination from "@/components/Pagination";
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// import permission from "./directive/permission";
import ElementUI from 'element-ui'
import eIconPicker from 'e-icon-picker';
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
import { Message } from 'element-ui'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree
} from "@/utils/ruoyi";
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' 
import * as echarts from 'echarts'

import '@/styles/index.scss' // global css

import App from './App'
// import store from './store'
// import router from './router'
import pMixin from '@/mixins/PMixin.js'
import request from '@/utils/request'//请求
import PPage from '@/components/PPage/PPage.vue'
import webConfig from '../webConfig'
Vue.mixin(pMixin)
Vue.component('p-page',PPage)//分页组件
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/index.scss'
import '@/icons' // icon
// import './permission' // permission control
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// if (process.env.NODE_ENV === 'development') {
  // require('@/mock/index')
// }
import './directive/permission/btn-permission'

Vue.component("Pagination", Pagination);
Vue.use(eIconPicker, {
  FontAwesome: true,
  ElementUI: true,
  eIcon: true,//自带的图标，来自阿里妈妈
  eIconSymbol: true,//是否开启彩色图标
  addIconList: [],
  removeIconList: [],
  zIndex: 3100//选择器弹层的最低层,全局配置
});
// Vue.use(permission);
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.$http = request;
Vue.prototype.$webConfig = webConfig;
Vue.prototype.$store = store

// 

import router from "@/router/router"
import routes from "@/router/routes"
import {bootstrap} from "@/hooks/useModule"

bootstrap({
  router,
  routes
}).then(({router}) => {
  store.dispatch("appLoad")
  
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
})

