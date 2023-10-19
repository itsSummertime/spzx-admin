import request from '@/utils/request'

// 商品单位接口
const API = '/admin/product/productUnit';

// 查询所有
export const FindAllProductUnit = () => {
  return request({
    url: `${API}/findAll`,
    method: 'get',
  })
}