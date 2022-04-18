import request from "@/utils/request";
// 角色列表
export function getstatisticsAndOrganizeApi() {
  return request({
    url: '/szkj-datamiddleground/order/orderStatisticsAndOrganize',
    method: "get",
  });
}

// 获取维护优化页面
export function getDefendApi(data) {
  return request({
    url: "/szkj-datamiddleground/order/getPageOrderListAndOrganize",
    method: "post",
    data,
  });
}

export function getUrgencyCountApi(workOrderState) {
    return request({
      url: `/szkj-datamiddleground/order/getUrgencyCount?workOrderState=${workOrderState}`,
      method: "get",
    });
  }
  
  export function getTwoFourCountApi(workOrderState) {
      return request({
        url: `/szkj-datamiddleground/order/getTwoFourCount?workOrderState=${workOrderState}`,
        method: "get",
      });
    }


