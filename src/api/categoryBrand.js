import request from '@/utils/request'

// 分类品牌接口
const API = '/admin/product/categoryBrand';

// 分页查询
export const FindCategoryBrandByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}

// 添加
export const AddCategoryBrand = (categoryBrand) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: categoryBrand,
  })
}

// 修改
export const UpdateCategoryBrand = (categoryBrand) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: categoryBrand,
  })
}

// 逻辑删除
export const DeleteCategoryBrand = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}