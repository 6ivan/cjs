import request from '@/utils/request'


export function login(params) {
  return request({
    url: '/szkj-usersystem/sys-user/login',
    method: 'get',
    params
  })
}
//获取用户路由权限
export function getMenuListByUser(){
  return request({
    url:'/szkj-usersystem/szkj-sys-menu/getMenuListByUser',
    method:'post'
  })
}
export function getButtonTypeListByUser(){
  return request({
    url:'/szkj-usersystem/szkj-sys-menu/getButtonTypeListByUser',
    method:'post'
  })
}


//获取token
export function getTokenApi(){
  return request({
    url: '/getToken',
    method: 'get',
  })
}
export function clearCache(){
  return request({
    url: '/clearCache',
    method: 'get',
  })
}

export function checkUserRoleAuthority(){
  return request({
    url: '/szkj-usersystem/sys-user/checkUserRoleAuthority',
    method: 'get',
  })
}
export function getInfo() {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


//获取用户分页列表
export function selectPage(data,pageNumber,pageSize) {
  return request({
    url: '/szkj-usersystem/sys-user/selectPage',
    method: 'post',
    data
  })
}
//新增/更新用户信息
export function saveOrUpdateUser(data) {
  return request({
    url: '/szkj-usersystem/sys-user/saveOrUpdateUser',
    method: 'post',
    data
  })
}


//注册
export function register(data) {
  return request({
    url: '/szkj-usersystem/sys-user/register',
    method: 'post',
    data
  })
}

//退出登录
export function logoutApi() {
  return request({
    url: '/szkj-usersystem/sys-user/logOut',
    method: 'get',
  })
}

export function getDetileApi(id) {
  return request({
    url: `/szkj-usersystem/sys-user/getUserById?userId=${id}`,
    method: 'get',
  })
}

export function deteleUserApi(id) {
  return request({
    url: `/szkj-usersystem/sys-user/delete?userId=${id}`,
    method: 'get',
  })
}


export function bindRole(data){
  return request({
    url:`/szkj-usersystem/sys-user/bindRole`,
    method:'POST',
    data
  })
}

export function getBindRole(data,id){
  return request({
    url:`/szkj-usersystem/sys-user/getBindRole?userId=${id}`,
    method:'POST',
    data
  })
}
