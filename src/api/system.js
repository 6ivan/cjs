import request from '@/utils/request'
// 系统列表
export function getUserSystemApi(data,pageNumber,pageSize){
    return request({
      url: '/szkj-usersystem/userSystem/sys-system/selectPage?pageNumber='+pageNumber+"&pageSize="+pageSize,
      method: 'post',
      data
    })
  }
  
  
// 新建或编辑系统信息
export function updateUserSystemApi(data){
    return request({
      url: '/szkj-usersystem/userSystem/sys-system/saveOrUpdateSystem',
      method: 'post', 
      data   
    })
  }
    //批量删除
export function deleteSystemApi(params) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-system/batchDelete?systemIds=${params}`,
    method: "post",
  });
}