import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { resetRouter } from '@/router'
import Permission from './router/permission'
import SessionStorage from '@/utils/session-storage.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist 改掉白名单然后把登录打开

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()
//   if (hasToken) {
//     resetRouter()
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           // await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) {
//       // if (whiteList.indexOf(to.path) > -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.beforeEach(async (to, from, next) => {
//   NProgress.start()
//   document.title = getPageTitle(to.meta.title)
//   const hasToken = getToken()
//   console.log(hasToken)
//   if (hasToken) {
//     if (to.path === '/login') {
//       console.log(123456)
//       if (SessionStorage.loadFromSession('userRoutes', []).length < 1) {
//         //路由鉴权表不存在
//         await store.dispatch('user/resetToken')
//         Message.error(error || 'Has Error')
//         next(`/login?redirect=${to.path}`)
//         NProgress.done()
//       }
//     } else {
//       //如果动态路由存在
//       if (store.getters.add_routes.length > 0) {
//         next()
//       } else {
//         // 否则，再次尝试动态生成路由
//         if (SessionStorage.loadFromSession('userRoutes', []).length < 1) {
//           // 路由权限表不存在
//           // 退出登录
//           await store.dispatch('user/resetToken')
//           next(`/login?redirect=${to.path}`)
//           return
//         }
//         try {
//           const accessRoutes = await store.dispatch(
//             'permission/generateRoutes',
//             SessionStorage.loadFromSession('userRoutes') || []
//           )
//           router.addRoutes(accessRoutes)

//           next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           // 退出登录
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//         }


//       }
//     }
//   } else {
//     console.log(3)
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next('/login')
//     }
//   }
// })

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
