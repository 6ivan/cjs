import request from "@/utils/request";
// 角色列表
export function getDepartmentApi(data,pageNumber,pageSize) {
  return request({
    url: '/szkj-usersystem/userSystem/sys-organize/selectPage?pageNumber='+pageNumber+"&pageSize="+pageSize,
    method: "post",
    data
  });
}

// 新建或编辑系统信息
export function updateDepartmentApi(data) {
  return request({
    url: "/szkj-usersystem/userSystem/sys-organize/saveOrUpdateOrganize",
    method: "post",
    data,
  });
}
//批量删除
export function deleteDepartmentApi(params) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-organize/batchDelete?organizeIds=${params}`,
    method: "post",
  });
}

export function getDepartmentTreeApi() {
  return request({
    url: '/szkj-usersystem/userSystem/sys-organize/selectTreeList',
    method: 'post',
  })
}

export function getDepartmentDetileApi(id) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-organize/getOrganizeData?requestData=%7Borganize_id%3A${id}%7D`,
    method: 'get',
  })
}
