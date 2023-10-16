import request from '@/utils/request'

// 角色菜单接口
const API = '/admin/system/sysRoleMenu';

// 分配菜单
export const AssignMenu = (assignMenuDto) => {
  return request({
    url: `${API}/assignMenu`,
    method: 'post',
    data: assignMenuDto
  })
}