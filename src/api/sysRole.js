import request from '@/utils/request'

const API = '/admin/system/sysRole/'

export const FindRoleListByPage = (pageNum,pageSize,queryDto) => {
  return request({
    url: `${API}findByPage/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryDto,
  })
}