
export function SET_ROUTER({ routes, router }) {
    router.$plugin = {
        addRoutes: (list, options) => {
            console.log(list, "addrouter")
            if (!options) {
                options = {}
            }

            list.map((e) => {
                if (!e.component) {
                    
                    // view_path 页面路径所在位置
                    let url = e.view_path
                    if (url) {
                        // 路径如果存在 代表是一个页面
                        // e.component = () => import(`@/${e.view_path}`)
                        // e.component = () => import(`@/views/index`)
                        e.component = (resolve) => require([`@/${e.view_path}`], resolve)
                    } else {
                        e.redirect = "/404"
                    }
                }
            })

            router.addRoutes([
                {
                    path: "/",
                    component: (resolve) => require(['@/layout'], resolve),
                    children: [...list, ...routes],
                    redirect: "/local/index"
                },
                {
                    path: "*",
                    redirect: "/404"
                }
            ])

        },


    }
}