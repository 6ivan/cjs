import request from "@/utils/request";
import qs from 'qs'
// 获取柱状图列表
export function getCityChartApi() {
  return request({
    url: '/szkj-datamiddleground/order/planning-org/cityChart',
    method: "get",
  });
}
// 获取申请清单分页列表
export function getConstructionApi(params,data) {
  return request({
    url: '/szkj-datamiddleground/order/planning-org/workOrderPage?'+qs.stringify(params),
    method: "post",
    data,
    
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


// 接受工单
export function acceptOrder(data) {
  return request({
    url: `/szkj-datamiddleground/order/planning-org/acceptOrder`,
    method: "post",
    data
  });
}

//入网匹配列表
export function accessMatchPage(data) {
    return request({
      url: `/szkj-datamiddleground/order/planning-org/accessMatchPage`,
      method: "post",
      data
    });
  }
  //确认匹配
export function accessMatch(data) {
    return request({
      url: `/szkj-datamiddleground/order/planning-org/accessMatch`,
      method: "post",
      data
    });
  }