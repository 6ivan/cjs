import { login, logout, getInfo, getTokenApi, checkUserRoleAuthority, getMenuListByUser, getButtonTypeListByUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Utils from '@/utils/utils';
import { flag, deepTree, getViewPath } from "@/utils"
import router from '@/router/router';
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    role: null,

    // 视图路由
    routes: JSON.parse(sessionStorage.getItem("viewRoutes")) || [],

    // 总菜单权限筛选分配
    menuGroup: JSON.parse(sessionStorage.getItem("menuGroup")) || [],

    // 侧边栏渲染  menuType !== 3
    menu: [],

    // 权限
    permissions: sessionStorage.getItem("permissions") || []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },


  // 设置路由信息
  SET_MENU_GROUP: (state, list) => {
    state.menuGroup = list
    sessionStorage.setItem("menuGroup", JSON.stringify(list))
  },

  // 设置视图路由
  SET_VIEWS_ROUTER: (state, list) => {
    console.log(list, "list")
    // TODO 待实现
    router.$plugin.addRoutes(list)
    state.routes = list;
    sessionStorage.setItem("viewRoutes", JSON.stringify(list))
  },

  // 设置菜单
  SET_MENU_LIST: (state) => {
    state.menu = state.menuGroup
  },

  SET_PERMISSION: (state, list) => {
    state.permissions = list
    sessionStorage.setItem("permissions", JSON.parse(JSON.stringify(list)))
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    let res = await getTokenApi()
    const { username, password } = userInfo
    commit('SET_TOKEN', res.data)
    setToken(res.data)
    return new Promise((resolve, reject) => {
      login({ userName: username, password: password }).then(async response => {
        // const { data } = response
        // console.log(response)
        // try {
        //   let resultRouter = await dispatch('fetchMenuTreeByUser')
        //   console.log(11)
        //   SessionStorage.saveToSession('userRoutes', resultRouter)
        // } catch (e) {
        //   reject(e)
        // } finally {
        //   resolve()
        // }
        resolve()
      }).catch(error => {
        console.log(error)
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  checkUserRoleAuthority({ commit, state }) {
    return new Promise((resolve, reject) => {
      checkUserRoleAuthority().then(response => {
        const { data } = response
        commit('SET_ROLE', data)
        // console.log(state.role)
        resolve(data)
        localStorage.setItem("role", data);
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMenuListByUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuListByUser().then(response => {
        // 获取路由表
        const menu = flag(response.data)
        // console.log(menu,'menumenumenu')

        // 1 菜单  2 页面   3权限
        const routes = menu.filter((e) => e.menuType !== 3).map(e => {
          return {
            id: e.menuId,
            parent_id: e.parentId,
            path: e.path,
            view_path: getViewPath(e.path),
            type: e.menuType,
            name: e.menuName,
            icon: e.icon,
            order_num: e.orderNum,
            isShow: e.visible === 0 ? false : true,
            meta: {
              icon: e.icon,
              title: e.menuName
            },
            children: []
          }
        })

        // 菜单格式化
        const menuGroup = deepTree(routes)

        // console.log(menuGroup, "menuGroup")


        // 获取所有的权限
        const  perms = menu.filter(e => e.menuType === 3).map(e => {
          // console.log(e)
          return e.menuName
        })
        console.log(perms)
        // 设置权限
        commit("SET_PERMISSION", perms)

        // 设置菜单组
        commit("SET_MENU_GROUP", menuGroup)

        // 设置视图路由
        commit("SET_VIEWS_ROUTER", routes.filter(e => e.type === 2))

        // 设置菜单
        commit("SET_MENU_LIST")

        resolve()
      })
    })
  },
  // 根据用户获取菜单下拉树列表
  // fetchMenuTreeByUser() {
  //   console.log(1)
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let resultRouter = await getMenuListByUser()
  //       let routerList = Utils.routerTreeToList(resultRouter.data.data)
  //       console.log(routerList)
  //       resolve(routerList)
  //     } catch (e) {
  //       reject(e)
  //     }
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      //有退出登录接口后可以打开
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

