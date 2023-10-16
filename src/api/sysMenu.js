import request from '@/utils/request'

// 菜单接口
const API = '/admin/system/sysMenu';

// 查询树节点菜单
export const FindTreeList = () => {
  return request({
    url: `${API}/findTreeList`,
    method: 'get',
  })
}

// 添加
export const AddMenu = (sysMenu) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: sysMenu,
  })
}

// 修改
export const UpdateMenu = (sysMenu) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: sysMenu,
  })
}

// 逻辑删除
export const DeleteMenu = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}

// 查询分配菜单列表
export const FindAssignMenuList = (roleId) => {
  return request({
    url: `${API}/findAssignMenuList/${roleId}`,
    method: 'get',
  })
}