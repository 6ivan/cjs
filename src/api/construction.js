import request from "@/utils/request";
// 获取柱状图列表
export function getCityChartApi() {
  return request({
    url: '/szkj-datamiddleground/order/station-access-apply/cityChart',
    method: "get",
  });
}
// 获取申请清单分页列表
export function getConstructionApi(data,pageNumber,pageSize,tab) {
  return request({
    url: '/szkj-datamiddleground/order/station-access-apply/selectPage?pageNumber='+pageNumber+"&pageSize="+pageSize+"&tab="+tab,
    method: "post",
    data
  });
}
// 获取工单流程
export function getProcessApi(id) {
  return request({
    url: '/szkj-datamiddleground/order/station-access-apply/processList?id='+id,
    method: "get",
  });
}

// 获取工单流程
export function submitApi(data) {
  return request({
    url: '/szkj-datamiddleground/order/station-access-apply/applySubmit',
    method: "post",
    data
  });
}


// 修改状态
export function putStatusApi(id,status,checkDetail) {
  return request({
    url: `/szkj-datamiddleground/order/station-access-apply/changeStatus?id=${id}&status=${status}&checkDetail=${checkDetail}`,
    method: "post",
  });
}

// 获取工单流程
export function countStationApi(tab) {
  return request({
    url: `/szkj-datamiddleground/order/station-access-apply/countStation?tab=${tab}`,
    method: "get",
  });
}



