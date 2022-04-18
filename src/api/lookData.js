import request from "@/utils/request";
// 角色列表
export function getDepartmentApi(data,pageNumber,pageSize) {
  return request({
    url: '/order/building-org-statistic/stationCityColumnGraph',
    method: "post",
    data
  });
}

// 
export function getStationLineGraphApi() {
  return request({
    url: "/szkj-datamiddleground/order/org-data-statistic/stationLineGraph",
    method: "GET",
  });
}
//批量删除
export function deleteDepartmentApi(params) {
  return request({
    url: `/szkj-usersystem/userSystem/sys-organize/batchDelete?organizeIds=${params}`,
    method: "post",
  });
}


export function getGolumnGraphApi(tab) {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/stationCityColumnGraph?tab=${tab}`,
    method: "GET",
  });
}

export function getStationGraphApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/stationColumnGraph`,
    method: "GET",
  });
}

// 建设部完结率饼图
export function getStationPieApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/jsStationPie`,
    method: "GET",
  });
}

// 获取各部门催办工单分页列表
export function getUrgeOrderPageApi(page,size,tab) {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/urgeOrderPage?pageNumber=${page}&pageSize=${size}&tab=${tab}`,
    method: "post",
  });
}

// 工单原因
export function getWorkOrderIssusesApi(tab) {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/getWorkOrderIssuses?tab=${tab}`,
    method: "get",
  });
}

// 工单原因
export function getCityColumnGraphApi(issue,tab) {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/workOrderCityColumnGraph?issue=${issue}&tab=${tab}`,
    method: "get",
  });
}


// 工单原因
export function getOrderColumnGraphApi(tab) {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/workOrderColumnGraph?tab=${tab}`,
    method: "get",
  });
}

//30天折线图
export function getOrderStatisticApi(tab) {
  return request({
    url: `/szkj-datamiddleground/order/orderStatistic?tab=${tab}`,
    method: "GET",
  });
}


// 规划部完结率饼图
export function getGhPieApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/ghStationPie`,
    method: "GET",
  });
}

// 优化部完结率饼图
export function getYhPieApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/yhStationPie`,
    method: "GET",
  });
}

// 维护部完结率饼图
export function getWhPieApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/whStationPie`,
    method: "GET",
  });
}

// 客服部完结率饼图
export function getFwPieApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/fwStationPie`,
    method: "GET",
  });
}

export function getOrderByOrgApi() {
  return request({
    url: `/szkj-datamiddleground/order/org-data-statistic/urgeOrderByOrg`,
    method: "GET",
  });
}



