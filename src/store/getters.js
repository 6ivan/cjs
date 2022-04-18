const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  
  // add_routes 是动态遍历出来的的路由
  add_routes: state => state.permission.addRoutes,
  // 按钮权限
  buttons: state => state.user.permissions,
  permission_routes: state => state.permission.routes,


  menuList: state => state.user.menu
}
export default getters
