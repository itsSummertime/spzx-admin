import request from '@/utils/request'

// 分类接口
const API = '/admin/product/category';

// 查询下一级分类
export const FindNextList = (parentId) => {
  return request({
    url: `${API}/findNextList/${parentId}`,
    method: 'get',
  })
}

// 导出Excel
export const ExportExcel = () => {
  return request({
    url: `${API}/exportExcel`,
    method: 'get',
    responseType: 'blob' //响应类型为二进制，用于接收响应的文件，默认接收json
  })
}

// 查询上级分类id
export const FindParentList = (id) => {
  return request({
    url: `${API}/findParentList/${id}`,
    method: 'get',
  })
}