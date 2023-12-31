<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="关键字">
            <el-input
              v-model="queryDto.keyword"
              style="width: 100%"
              placeholder="用户名、姓名、手机号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="createTime"
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-button type="primary" size="small" @click="fetchData">
          搜索
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="showAdd">添 加</el-button>
  </div>

  <!---数据表格-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="userName" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="160" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="showUpdate(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
        删除
      </el-button>
      <el-button type="warning" size="small" @click="assignRoleShow(scope.row)">
        分配角色
      </el-button>
    </el-table-column>
  </el-table>

  <!--分页条-->
  <el-pagination
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :page-sizes="[5, 10, 15, 20]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="fetchData"
    @current-change="fetchData"
  />

  <!-- 添加或修改的弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="sysUser.userName" />
      </el-form-item>
      <el-form-item v-if="sysUser.id == null" label="密码">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/file/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="onSuccess"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 分配角色的弹窗 -->
  <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input disabled :value="sysUser.userName"></el-input>
      </el-form-item>

      <el-form-item label="角色列表">
        <el-checkbox-group v-model="userRoleIds">
          <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="assignRoleSubmit">提交</el-button>
        <el-button @click="dialogRoleVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  FindUserListByPage,
  AddUser,
  UpdateUser,
  DeleteUser,
} from '@/api/sysUser'
import { FindAssignRoleList } from '@/api/sysRole'
import { AssignRole } from '@/api/sysUserRole'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'

//上传组件的请求头
const headers = ref({
  token: useApp().authorization.token,
})

//分配角色的弹窗>>>
// 是否显示
const dialogRoleVisible = ref(false)
// 所有角色列表
const allRoles = ref([])
// 拥有的角色id列表
const userRoleIds = ref([])

//添加或修改的弹窗>>>
// 是否显示
const dialogVisible = ref(false)
// 标题
const dialogTitle = ref('添加或修改')
// 绑定的对象
const sysUser = ref({})

// 表格数据模型
const list = ref([])
// 分页条数据模型
const total = ref(0)
// 当前页码
const pageNum = ref(1)
// 每页行数
const pageSize = ref(5)
// 查询条件
const queryDto = ref({})

//时间组件绑定的变量
const createTime = ref('')

// 钩子函数onMounted，页面打开后马上执行
onMounted(() => {
  //查询用户列表
  fetchData()
})

//分配角色的提交
const assignRoleSubmit = async () => {
  //需要提交的参数
  const assignRoleDto = {
    userId: sysUser.value.id,
    roleIdList: userRoleIds.value,
  }

  //发送ajax请求
  const { code } = await AssignRole(assignRoleDto)
  if (code === 200) {
    ElMessage.success('分配角色成功')
    dialogRoleVisible.value = false
    fetchData()
  }
}

//分配角色的显示
const assignRoleShow = async row => {
  //显示窗口、回显用户名
  dialogRoleVisible.value = true
  sysUser.value = { ...row }

  //发送ajax请求获取两个列表数据
  const { code, data } = await FindAssignRoleList(sysUser.value.id)
  if (code === 200) {
    //所有角色列表
    allRoles.value = data.allRoleList
    //拥有的角色id
    userRoleIds.value = data.assignRoleList
  }
}

// 上传的请求发送后
const onSuccess = response => {
  if (response.code === 200) {
    //回显图片
    sysUser.value.avatar = response.data
  } else {
    ElMessage.error(response.message)
  }
}

//逻辑删除
const deleteById = id => {
  ElMessageBox.confirm('此操作将删除该数据. 确定?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteUser(id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {})
}

//显示修改的窗口
const showUpdate = row => {
  //显示窗口、修改标题、数据回显
  dialogVisible.value = true
  dialogTitle.value = '修改用户'
  sysUser.value = { ...row }
}

//弹窗的提交按钮
const submit = async () => {
  if (sysUser.value.id) {
    //有id, 执行修改
    var { code } = await UpdateUser(sysUser.value)
  } else {
    //没有id, 执行添加
    var { code } = await AddUser(sysUser.value)
  }

  if (code === 200) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchData()
  }
}

//显示添加的弹窗
const showAdd = () => {
  //显示窗口、修改标题、清空表单
  dialogVisible.value = true
  dialogTitle.value = '添加用户'
  sysUser.value = {}
}

//重置
const reset = () => {
  queryDto.value = {}
  createTime.value = ''
  fetchData()
}

//分页查询
const fetchData = async () => {
  if (createTime.value != '') {
    //如果选择了时间，则提取出开始时间和结束时间
    queryDto.value.createTimeBegin = createTime.value['0']
    queryDto.value.createTimeEnd = createTime.value['1']
  }

  //发送ajax请求
  const { code, data } = await FindUserListByPage(
    pageNum.value,
    pageSize.value,
    queryDto.value
  )
  if (code === 200) {
    list.value = data.list
    total.value = data.total
  }
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>