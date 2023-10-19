import request from '@/utils/request'

// 商品接口
const API = '/admin/product/product';

// 分页查询
export const FindProductListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}

// 添加
export const AddProduct = (product) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: product,
  })
}

// 修改
export const UpdateProduct = (product) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: product,
  })
}

// 逻辑删除
export const DeleteProduct = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}

// 查询详情
export const FindProductById = (id) => {
  return request({
    url: `${API}/findById/${id}`,
    method: 'get',
  })
}

// 审核
export const UpdateProductAuditStatus = (id, auditStatus) => {
  return request({
    url: `${API}/updateAuditStatus/${id}/${auditStatus}`,
    method: 'put',
  })
}

// 上架与下架
export const UpdateProductStatus = (id, status) => {
  return request({
    url: `${API}/updateStatus/${id}/${status}`,
    method: 'put',
  })
}