import request from '@/utils/request'

// 角色接口
const API = '/admin/system/sysRole';

// 分页查询
export const FindRoleListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}

// 添加
export const AddRole = (sysRole) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: sysRole,
  })
}

// 修改
export const UpdateRole = (sysRole) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: sysRole,
  })
}

// 逻辑删除
export const DeleteRole = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}

// 查询分配角色列表
export const FindAssignRoleList = (userId) => {
  return request({
    url: `${API}/findAssignRoleList/${userId}`,
    method: 'get',
  })
}