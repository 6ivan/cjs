import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import ViuwData from './ViewData.js'
// import Server from './server.js'
// import Permission from './permission.js'
// import Plan from './plan.js'
// import Optimization from './optimization.js'
// import Maintain from './maintain.js'

import SessionStorage from "@/utils/session-storage.js"
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 拿到匹配路由的第一个
function getFirstRouter() {
  let routeArr = SessionStorage.loadFromSession('userRoutes', [])

  for (let index = 0; index < routeArr.length; index++) {
    const route = routeArr[index]
    for (let i = 0; i < routeArr.length; i++) {
      if (routeArr[i].parentId == route.menuId) {
        return routeArr[i].path
        break
      }
    }
  }
  // 没有拿到匹配的路由，不能跳转到主页面，给一个提示
  // Message.warning('当前用户没有权限访问页面')
  return '/login'
}


// 动态生成登录后的跳转页
function getHomePage() {
  return getFirstRouter()
}

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },


  {
    path: '/',
    component: Layout,
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import("@/views/index/index"),
        hidden: true
      }
    ]
    // redirect: () => getHomePage()
    // redirect: () => import("@/views/index/index")
    // children: [{
    //   path: 'dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/local/index'),
    //   meta: { title: '首页', icon: 'dashboard' }
    // }]
  },



]

export const endBasicRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 动态路由
 * 根据角色和后端返回的路由来匹配
 */
export const asyncRoutes = []

/**
* 如果系统页面模块比较多，也可以分模块写
*/
/**
 * 自动扫描 modules 里面的路由模块，路由模块请根据业务自行拆分
 * modules 里面只能存放动态路由（需要根据权限来选择的路由）
 * 插入到 asyncRoutes 中
 * 基础路由全部写到constantRoutes中
 */
const files = require.context('./modules', false, /\.js$/)
files.keys().forEach(key => {
  const file = files(key).default
  // 根据导出的内容判断是否数组，如果数组需使用扩展运算符
  if (Array.isArray(file)) {
    asyncRoutes.push(...file)
  } else {
    asyncRoutes.push(file)
  }
})


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
