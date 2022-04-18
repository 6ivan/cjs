import Vue from "vue"
import VueRouter from "vue-router"
import routes from "./routes"
import { getToken } from '@/utils/auth' // get token from cookie

Vue.use(VueRouter)

// 路由白名单
const whiteList = ["/login", "/404", '/register']

const Router = new VueRouter({
    // mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes,
})


Router.beforeEach((to, from, next) => {
    const hasToken = getToken()

    console.log(hasToken, "hasToken")

    if (hasToken) {

        // token 存在的情况下需要处理什么自己处理就好了
        if (to.path !== "/login") {
            next()
        } else {
            next("/");
        }

    } else {
        if (!whiteList.some(e => to.path.includes(e))) {
            return next("/login")
        }

        next();
    }

})


export default Router