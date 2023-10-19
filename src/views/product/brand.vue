<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="showAdd">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="name" label="品牌名称" />
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50" />
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="showUpdate(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deletById(scope.row.id)">
        删除
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
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌名称">
        <el-input v-model="brand.name" />
      </el-form-item>
      <el-form-item label="品牌图标">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/file/upload"
          :show-file-list="false"
          :on-success="onSuccess"
          :headers="headers"
        >
          <img v-if="brand.logo" :src="brand.logo" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useApp } from '@/pinia/modules/app'
import {
  FindBrandListByPage,
  AddBrand,
  UpdateBrand,
  DeleteBrand,
} from '@/api/brand'
import { ElMessage, ElMessageBox } from 'element-plus'

//上传组件的请求头
const headers = ref({
  token: useApp().authorization.token,
})

//添加或修改的弹窗>>>>>>
//是否显示
const dialogVisible = ref(false)
//标题
const dialogTitle = ref('')
//提交的对象
const brand = ref({})

// 定义表格数据模型
const list = ref([])
// 分页条数据模型
const total = ref(0)
// 当前页码
const pageNum = ref(1)
// 每页行数
const pageSize = ref(5)

// 钩子函数onMounted，页面打开后马上执行
onMounted(() => {
  fetchData()
})

// 逻辑删除
const deletById = id => {
    ElMessageBox.confirm('此操作将删除该数据. 确定?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteBrand(id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {})
}

// 显示修改的窗口
const showUpdate = row => {
  //显示窗口、修改标题、回显数据
  dialogVisible.value = true
  dialogTitle.value = '修改品牌'
  brand.value = { ...row }
}

// 弹窗的提交按钮
const saveOrUpdate = async () => {
  if (brand.value.id) {
    //有id，执行修改
    var { code } = await UpdateBrand(brand.value)
  } else {
    //没有id，执行添加
    var { code } = await AddBrand(brand.value)
  }

  if (code === 200) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchData()
  }
}

// 上传的请求发送后
const onSuccess = response => {
  if (response.code === 200) {
    //回显图片
    brand.value.logo = response.data
  } else {
    ElMessage.error(response.message)
  }
}

// 显示添加的窗口
const showAdd = () => {
  //显示窗口、修改标题、清空表单
  dialogVisible.value = true
  dialogTitle.value = '添加品牌'
  brand.value = {}
}

// 分页查询
const fetchData = async () => {
  const { code, data } = await FindBrandListByPage(
    pageNum.value,
    pageSize.value
  )
  if (code === 200) {
    list.value = data.list
    total.value = data.total
  }
}
</script>

<style scoped>
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
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