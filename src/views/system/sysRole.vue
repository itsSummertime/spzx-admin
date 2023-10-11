<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input style="width: 100%" placeholder="角色名称" v-model="queryDto.roleName"></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="fetchData">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!-- 添加按钮 -->
  <div class="tools-div">
    <el-button type="success" size="small" @click="showAdd">添 加</el-button>
  </div>

  <!--- 角色表格数据 -->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="roleName" label="角色名称" width="180" />
    <el-table-column prop="roleCode" label="角色编码" width="180" />
    <el-table-column prop="description" label="角色描述" width="180" />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="showUpdate(scope.row)">修改</el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row.id)">删除</el-button>
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

  <!-- 添加角色表单对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="sysRole.roleName" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="sysRole.roleCode" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="sysRole.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  FindRoleListByPage,
  AddRole,
  UpdateRole,
  DeleteRole,
} from '@/api/sysRole'

//弹窗是否显示
let dialogVisible = ref(false)
//弹窗的标题
let dialogTitle = ref('添加获取修改角色')
//弹窗绑定的对象
let sysRole = ref({})

// 分页条总记录数
let total = ref(0)
// 定义表格数据模型
let list = ref([])
// 当前页码
let pageNum = ref(1)
// 每页行数
let pageSize = ref(5)
//查询条件
let queryDto = ref({ roleName: '' })

// 钩子函数onMounted，页码打开后马上执行
onMounted(() => {
  //获取角色列表
  fetchData()
})

//重置
const reset = ()=>{
  queryDto.value = {}
  fetchData()
}

//逻辑删除
const deleteById = async id => {
  ElMessageBox.confirm(
    '此操作将删除该数据. 确定?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        const { code } = await DeleteRole(id)
        if (code === 200) {
            ElMessage.success('删除成功')
            fetchData()
        }
    })
    .catch(() => {})
}

//显示修改的窗口
const showUpdate = row => {
  //显示窗口、修改标题、回显数据
  dialogVisible.value = true
  dialogTitle.value = '修改角色'

  //将sysRole对象的内存地址 指向 row对象的内存地址
  //sysRole.value = row

  //复制row对象的所有属性 给sysRole对象
  sysRole.value = { ...row }
}

//弹窗的提交按钮
const submit = async () => {
  //判断是否有id
  if (sysRole.value.id) {
    //有id，执行修改
    var { code } = await UpdateRole(sysRole.value)
  } else {
    //没有id，执行添加
    var { code } = await AddRole(sysRole.value)
  }

  if (code === 200) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchData()
  }
}

//显示添加的窗口
const showAdd = () => {
  //显示窗口、修改标题、清空表单
  dialogVisible.value = true
  dialogTitle.value = '添加角色'
  sysRole.value = {}
}

//获取角色列表
const fetchData = async () => {
  //发送ajax请求
  const { code, message, data } = await FindRoleListByPage(
    pageNum.value,
    pageSize.value,
    queryDto.value
  )
  if (code === 200) {
    list.value = data.list
    total.value = data.total
  } else {
    ElMessage.error(message)
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