// import { constantRoutes } from '@/router'
// import { getRouters } from '@/api/menu'
// import Layout from '@/layout/index'
// import ParentView from '@/components/ParentView';


// const permission = {
//   state: {
//     routes: [],
//     addRoutes: [],
//     defaultRoutes: [],
//     topbarRouters: [],
//     sidebarRouters: []
//   },
//   mutations: {
//     SET_ROUTES: (state, routes) => {
//       state.addRoutes = routes
//       state.routes = constantRoutes.concat(routes)
//     },
//     SET_DEFAULT_ROUTES: (state, routes) => {
//       state.defaultRoutes = constantRoutes.concat(routes)
//     },
//     SET_TOPBAR_ROUTES: (state, routes) => {
//       // 顶部导航菜单默认添加统计报表栏指向首页
//       const index = [{
//         path: 'index',
//         meta: { title: '统计报表', icon: 'dashboard'}
//       }]
//       state.topbarRouters = routes.concat(index);
//     },
//     SET_SIDEBAR_ROUTERS: (state, routes) => {
//       state.sidebarRouters = routes
//     },
//   },
//   actions: {
//     // 生成路由
//     GenerateRoutes({ commit }) {
//       return new Promise(resolve => {
//         // 向后端请求路由数据
//         getRouters().then(res => {
//           const sdata = JSON.parse(JSON.stringify(res.data))
//           const rdata = JSON.parse(JSON.stringify(res.data))
//           const sidebarRoutes = filterAsyncRouter(sdata)
//           const rewriteRoutes = filterAsyncRouter(rdata, false, true)
//           rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
//           commit('SET_ROUTES', rewriteRoutes)
//           commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
//           commit('SET_DEFAULT_ROUTES', sidebarRoutes)
//           commit('SET_TOPBAR_ROUTES', sidebarRoutes)
//           resolve(rewriteRoutes)
//         })
//       })
//     }
//   }
// }

// // 遍历后台传来的路由字符串，转换为组件对象
// function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
//   return asyncRouterMap.filter(route => {
//     if (type && route.children) {
//       route.children = filterChildren(route.children)
//     }
//     if (route.component) {
//       // Layout ParentView 组件特殊处理
//       if (route.component === 'Layout') {
//         route.component = Layout
//       } else if (route.component === 'ParentView') {
//         route.component = ParentView
//       } else {
//         route.component = loadView(route.component)
//       }
//     }
//     if (route.children != null && route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children, route, type)
//     } else {
//       delete route['children']
//       delete route['redirect']
//     }
//     return true
//   })
// }

// function filterChildren(childrenMap, lastRouter = false) {
//   var children = []
//   childrenMap.forEach((el, index) => {
//     if (el.children && el.children.length) {
//       if (el.component === 'ParentView') {
//         el.children.forEach(c => {
//           c.path = el.path + '/' + c.path
//           if (c.children && c.children.length) {
//             children = children.concat(filterChildren(c.children, c))
//             return
//           }
//           children.push(c)
//         })
//         return
//       }
//     }
//     if (lastRouter) {
//       el.path = lastRouter.path + '/' + el.path
//     }
//     children = children.concat(el)
//   })
//   return children
// }

// export const loadView = (view) => { // 路由懒加载
//   return (resolve) => require([`@/views/${view}`], resolve)
// }

// export default permission
import { asyncRoutes, constantRoutes, endBasicRoutes } from '@/router'
import Utils from '@/utils/utils';

const state = {
  // 按钮权限
  btns: [],
  routes: constantRoutes,
  addRoutes: []
}
/**
 * 前端动态路由是否在后端返回的路由权限中
 * @param asyncRoutes - 前端动态路由表
 * @param path -前端静态配置的路由表具体路由对象
 */
 function getPermissionOfAsyncRoutes(asyncRoutes, id) {
  for (let index = 0; index < asyncRoutes.length; index++) {
    const element = asyncRoutes[index]
    if (element.id == id) {
      return element
    }
    if (element.originChild) {
      element.children = element.originChild
    }
    if (element.children) {
      element.originChild = element.children
      let target = getPermissionOfAsyncRoutes(element.children, id)
      if (target) {
        return target
      }
    }
  }
  return null
}


/**
 * Filter asynchronous routing tables by recursion
 * @param asyncRoutes 前端配置的动态路由表
 * @param routes 接口返回的有权限的路由
 * 两者做一个匹配
 */
 export function filterAsyncRoutes(asyncRoutes, routes) {
  for (let index = 0; index < routes.length; index++) {
    let route = routes[index]
    let aRoute = getPermissionOfAsyncRoutes(asyncRoutes, route.menuId)
    if (aRoute) {
      aRoute.order = route.orderNum
      aRoute.parentId = route.parentId
      aRoute.path = route.path
      if (aRoute.meta && route.menuName) {
        aRoute.meta.title = route.menuName
      }
      routes[index] = aRoute
    } else {
      routes.splice(index, 1)
      index--
    }
  }
  routes.forEach(route => {
    route.children = null
  })

  // 菜单排序
  routes.sort((a, b) => {
    return a.order - b.order
  })

  // 有数据
  let res = Utils.formatTree(routes, 'id', 'parentId', '99')

  return res
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, btns) => {
    state.btns = btns
  }
}

const actions = {
  /**
   * @param {routes} 接口返回的路由
   */
  generateRoutes({ commit }, routes) {
  console.log("返回")
    // 菜单路由（type为1或者2的是路由/页面菜单权限）
    let menuRoles = routes.filter(item => {
      return item.menuType == '1' || item.menuType == '2'
    })

    // 按钮权限表（type为3的代表可以显示的按钮权限）
    let btnPermissions = routes.filter(item => {
      return item.menuType == '3'
    })

    let btns = []
    if (btnPermissions && btnPermissions.length > 0) {
      btnPermissions.forEach(item => {
        btns.push(item.perms || null)
      })
    }
    commit('SET_BUTTONS', btns)

    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRoutes(asyncRoutes, menuRoles)
      accessedRoutes.push(...endBasicRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}