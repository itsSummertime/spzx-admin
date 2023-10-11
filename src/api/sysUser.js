import request from '@/utils/request'

// 用户接口
const API = '/admin/system/sysUser';

// 分页查询
export const FindUserListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${API}/findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}

// 添加
export const AddUser = (sysUser) => {
  return request({
    url: `${API}/add`,
    method: 'post',
    data: sysUser,
  })
}

// 修改
export const UpdateUser = (sysUser) => {
  return request({
    url: `${API}/update`,
    method: 'put',
    data: sysUser,
  })
}

// 逻辑删除
export const DeleteUser = (id) => {
  return request({
    url: `${API}/delete/${id}`,
    method: 'delete',
  })
}