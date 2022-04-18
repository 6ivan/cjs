import request from "@/utils/request";

// 获取权限管理
export function getPowerApi(data) {
  return request({
    url: "/szkj-usersystem/szkj-sys-menu/getMenuTree",
    method: "post",
    data,
  });
}

export function putPowerApi(data) {
  return request({
    url: "/szkj-usersystem/szkj-sys-menu/saveOrUpdateMenu",
    method: "post",
    data,
  });
}

export function getDetileApi(id) {
  return request({
    url: `/szkj-usersystem/szkj-sys-menu/saveOrUpdateMenu?menuId=${id}`,
    method: "get",
  });
}

// 删除角色
export function deleteRoleApi(roleIds) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/batchDelete`,
    method: "post",
    params: {roleIds}
  });
}

// 删除菜单接口
export function deleteMenuApi(data,menuId) {
  return request({
    url: `/szkj-usersystem/szkj-sys-menu/delete?menuId=${menuId}`,
    method: "post",
    data
  });
}

// 获取角色列表
export function getRoleListApi(data){
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/selectPage`,
    method: "post",
    // data,
    params: data
  });
}

// 获取部门列表
export function getOrganizeListApi(data){
  return request({
    url: `/szkj-usersystem/userSystem/sys-organize/selectTreeList`,
    method: "post",
    data,
  });
}

//查询角色绑定的组织
export function getBindOrganizeApi(params){
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/getBindOrganize`,
    method: "get",
    params,
  });
}

//绑定角色和组织数据

export function bindOrganizeApi(data){
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/bindOrganize`,
    method: "post",
    data,
  });
}
