import request from '@/utils/request'

// 用户角色接口
const API = '/admin/system/sysUserRole';

// 分页查询
export const AssignRole = (assignRoleDto) => {
  return request({
    url: `${API}/assignRole`,
    method: 'post',
    data: assignRoleDto,
  })
}