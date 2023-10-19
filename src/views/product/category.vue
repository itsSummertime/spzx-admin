<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="exportData">导出</el-button>
    <el-upload
      style="display: inline; margin-left: 10px"
      class="avatar-uploader"
      action="http://localhost:8501/admin/product/category/importExcel"
      :show-file-list="false"
      :headers="headers"
      :on-success="onSuccess"
    >
      <el-button type="primary" size="small">导入</el-button>
    </el-upload>
  </div>

  <!---懒加载的树形表格-->
  <el-table
    :data="list"
    style="width: 100%"
    row-key="id"
    border
    lazy
    :load="fetchData"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="分类名称" />
    <el-table-column prop="imageUrl" label="图标" #default="scope">
      <img :src="scope.row.imageUrl" width="50" />
    </el-table-column>
    <el-table-column prop="orderNum" label="排序" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
  </el-table>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { FindNextList, ExportExcel } from '@/api/category'
import { useApp } from '@/pinia/modules/app'
import { ElMessage } from 'element-plus'

// 定义list属性模型
const list = ref([])
//上传组件的请求头
const headers = ref({
  token: useApp().authorization.token,
})

// 钩子函数onMounted，页面打开后马上执行
onMounted(() => {
  initData()
})

//初始化数据，加载一级分类
const initData = async () => {
  //发送ajax请求，查询一级分类
  const { code, data } = await FindNextList(0)
  if (code === 200) {
    list.value = data
  }
}

// 上传文件的请求发送后
const onSuccess = response => {
  if (response.code === 200) {
    ElMessage.success('导入成功')
    initData()
  } else {
    ElMessage.error(response.message)
  }
}

// 导出Excel
const exportData = async () => {
  //发送ajax请求，获取响应的文件
  const response = await ExportExcel()

  //构建文件对象
  let blob = new Blob([response])
  //创建超链接标签a
  let a = document.createElement('a')
  //给超链接赋值具体的路径, 指向文件对象
  a.href = window.URL.createObjectURL(blob)
  //下载的文件名
  a.download = '商品分类.xlsx'
  //触发超链接的点击事件
  a.click()
}

// 加载数据的方法
const fetchData = async (row, treeNode, resolve) => {
  //发送ajax请求，查询点击的分类 的 下一级分类
  const { code, data } = await FindNextList(row.id)
  if (code === 200) {
    // 返回数据
    resolve(data)
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