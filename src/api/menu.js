import request from '@/utils/request'

// 获取菜单
export const GetMenus = params => {
  return request({
    url: '/admin/system/sysMenu/findAccessMenuList',
    method: 'get',
    params,
  })
}


// 逻辑删除
export const DeleteMenu = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}