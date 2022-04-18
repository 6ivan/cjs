import request from '@/utils/request'
// 角色列表
export function getRoleApi(data,pageNumber,pageSize){
    return request({
      url: '/szkj-usersystem/userSystem/sys-role/selectPage?pageNumber='+pageNumber+"&pageSize="+pageSize,
      method: 'post', 
      data   
    })
  }
  
  
// 新建或编辑系统信息
export function updateRoleApi(data){
    return request({
      url: '/szkj-usersystem/userSystem/sys-role/saveOrUpdateRole',
      method: 'post', 
      data   
    })
  }

  //批量删除
export function deleteRoleApi(params) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/batchDelete?roleIds=${params}`,
    method: "post",
  });
}

export function getRoleDetileApi(id) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/getRoleData?requestData=%7Brole_id%3A${id}%7D`,
    method: "get",
  });
}

export function bindOrganize1Api(data) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/bindOrganize`,
    method: "post",
    data,
  });
}

export function getMenuByRoleIdApi(data) {
  return request({
    url: `/szkj-usersystem/szkj-sys-menu/getMenuByRoleId`,
    method: "post",
    data,
  });
}

export function authorityBindingApi(data) {
  return request({
    url: `/szkj-usersystem/szkj-sys-menu/authorityBinding`,
    method: "post",
    data,
  });
}

export function getBindOrganizeApi(id) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-role/getBindOrganize?roleId=${id}`,
    method: "get",
  });
}
