import { SET_ROUTER } from "./useRouter"


export async function bootstrap(options) {
    const {router, routes} = options

    SET_ROUTER({router, routes})

    return {
        router, 
        routes
    }
}