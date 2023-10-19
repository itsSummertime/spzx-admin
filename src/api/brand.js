import request from '@/utils/request'

// 品牌接口
const API = '/admin/product/brand';

// 分页查询
export const FindBrandListByPage = (pageNum, pageSize) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'get',
  })
}

// 添加
export const AddBrand = (brand) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: brand,
  })
}

// 修改
export const UpdateBrand = (brand) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: brand,
  })
}

// 逻辑删除
export const DeleteBrand = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}

// 查询所有
export const FindAllBrand = () => {
  return request({
    url: `${API}/findAll`,
    method: 'get',
  })
}

// 根据分类id查询
export const FindBrandByCategoryId = (categoryId) => {
  return request({
    url: `${API}/findByCategoryId/${categoryId}`,
    method: 'get',
  })
}