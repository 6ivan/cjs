import request from "@/utils/request";
import qs from 'qs'
// 获取首页柱状图列表
export function orderStatistics(params) {
  return request({
    url: '/szkj-datamiddleground/order/orderStatistics',
    method: "get",
    params
  });
}
// 获取手工柱状图列表
export function orderStateStatistics(params) {
  return request({
    url: '/szkj-datamiddleground/order/orderStateStatistics',
    method: "get",
    params
  });
}
// 获取手工列表
export function getOrderList(data,type=false) {
  return request({
    url: '/szkj-datamiddleground/order/getOrderList?type='+type,
    method: "post",
    data
  });
}
// 获取手工列表
export function quantityStatistics() {
  return request({
    url: '/szkj-datamiddleground/order/quantityStatistics',
    method: "get",
  });
}
// 获取柱状图列表
export function getCityChartApi(params) {
  return request({
    url: '/szkj-datamiddleground/order/workDistribute',
    method: "get",
    params
  });
}
//客服首页列表
export function getPageOrderList(data) {
    return request({
      url: '/szkj-datamiddleground/order/getPageOrderList',
      method: "post",
      data,
    });
  }
  //客服首页列表2
export function orderTypeStatistics(data) {
    return request({
      url: '/szkj-datamiddleground/order/orderTypeStatistics',
      method: "post",
      data,
    });
  }

// 获取工单分拣分页列表 
export function getPageWaitWorkList(data,type=false) {
    return request({
      url: '/szkj-datamiddleground/order/getPageWaitWorkList?type='+type,
      method: "post",
      data,
    });
  }
  //新增手工单
  export function addManualOrder(params,data) {
    return request({
      url: '/szkj-datamiddleground/order/addManualOrder?'+qs.stringify(params),
      method: "post",
      data,
    });
  }
  //根据工单编号查询详情
  export function getOrderNumberDetails(params) {
    return request({
      url: '/szkj-datamiddleground/order/getOrderNumberDetails',
      method: "get",
      params,
    });
  }
 //分发
 export function addDistribute(data) {
  return request({
    url: '/szkj-datamiddleground/order/addDistribute',
    method: "post",
    data
  });
}
 //催办
 export function prompt(data) {
  return request({
    url: '/szkj-datamiddleground/order/prompt',
    method: "post",
    data
  });
}
  
 //地区
 export function returnTerrain() {
  return request({
    url: '/szkj-datamiddleground/order/returnTerrain',
    method: "get"
  });
}
  
  
 