import request from '@/utils/request'

// 商品规格接口
const API = '/admin/product/productSpec';

// 分页查询
export const FindProductSpecListByPage = (pageNum, pageSize) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'get',
  })
}

// 添加
export const AddProductSpec = (productSpec) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: productSpec,
  })
}

// 修改
export const UpdateProductSpec = (productSpec) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: productSpec,
  })
}

// 逻辑删除
export const DeleteProductSpec = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}

// 查询所有
export const FindAllProductSpec = () => {
  return request({
    url: `${API}/findAll`,
    method: 'get',
  })
}