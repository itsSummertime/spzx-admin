import request from '@/utils/request'

// 用户接口
const API = '/admin/system/sysUserRole';

export const AssignRole = (assignRoleDto) => {
  return request({
    url: `${API}/assignRole`,
    method: 'post',
    data: assignRoleDto,
  })
}
