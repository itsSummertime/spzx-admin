import request from '@/utils/request'

// 订单统计接口
const API = '/admin/order/orderStatistics';

// 统计订单总金额
export const FindOrderTotalAmount = (queryDto) => {
  return request({
    url: `${API}/findOrderTotalAmount`,
    method: 'post',
    data: queryDto,
  })
}