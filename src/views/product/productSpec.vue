<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="AddProductSpecShow">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="specName" label="规格名称" />
    <el-table-column label="规格值" width="350" #default="scope">
      <div
        v-for="(item1, index1) in scope.row.specValue"
        :key="index1"
        style="pAddProductSpecing: 5px; margin: 0; width: 100%"
      >
        {{ item1.key }}：
        <span
          v-for="(item2, index2) in item1.valueList"
          :key="index2"
          class="div-atrr"
        >
          {{ item2 }}
        </span>
      </div>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
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

  <!-- 添加和修改的弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
    <el-form label-width="120px">
      <el-form-item label="规格名称">
        <el-input v-model="productSpec.specName" />
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="success" @click="AddProductSpecSpec">
          添加新规格
        </el-button>
      </el-form-item>
      <el-form-item
        label
        v-for="(item, index) in productSpec.specValue"
        :key="index"
      >
        <el-row>
          <el-col :span="10">
            <el-input
              v-model="item.key"
              placeholder="规格"
              style="width: 90%"
            />
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="item.valueList"
              placeholder="规格值(如:白色,红色)"
              style="width: 90%"
            />
          </el-col>
          <el-col :span="4">
            <el-button size="default" type="danger" @click="delSpec(index)">
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { FindProductSpecListByPage, AddProductSpec, UpdateProductSpec, DeleteProductSpec } from '@/api/productSpec.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据模型
const list = ref([])
// 分页条数据模型
const total = ref(0)
// 当前页码
const pageNum = ref(1)
// 每页行数
const pageSize = ref(5)

// 弹窗是否显示
const dialogVisible = ref(false)
// 弹窗的标题
const dialogTitle = ref('添加商品规格')
// 弹窗提交的对象
const productSpec = ref({ specValue: [] })

// 页面打开后马上执行
onMounted(() => {
  // 分页查询
  fetchData()
})

//修改的按钮
const editShow = row => {
  dialogTitle.value = '修改商品规格'
  dialogVisible.value = true

  //将row转为json字符串，再转为json对象后赋值给productSpec
  productSpec.value = JSON.parse(JSON.stringify(row))
}

//添加的按钮
const AddProductSpecShow = () => {
  dialogTitle.value = '修改商品规格'
  dialogVisible.value = true
  productSpec.value = { specValue: [] }
}

// 页面添加规格操作
const AddProductSpecSpec = () => {
  productSpec.value.specValue.push({})
}

// 页面删除规格元素
const delSpec = index => {
  productSpec.value.specValue.splice(index, 1)
}

// 提交表单
const saveOrUpdate = async () => {
  // 需要将productSpec.value.specValue转换成json字符串提交到后端，通过复制一个新的对象进行实现
  const productSpecClone = JSON.parse(JSON.stringify(productSpec.value))
  // 将productSpecClone.spectValue中的valueList转为json数组对象
  productSpecClone.specValue.forEach(item => {
    item.valueList = item.valueList.split(',')
  })
  // 将productSpecClone.specValue转为json字符串
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)

  if (productSpec.value.id) {
    await UpdateProductSpec(productSpecClone)
  } else {
    await AddProductSpec(productSpecClone)
  }

  dialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

//逻辑删除
const deleteById = id => {
  ElMessageBox.confirm('此操作将删除该数据,是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      //执行删除的ajax请求
      await DeleteProductSpec(id)
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {})
}

// 分页查询
const fetchData = async () => {
  const { data } = await FindProductSpecListByPage(pageNum.value, pageSize.value)
  data.list.forEach(item => {
    item.specValue = JSON.parse(item.specValue) // 将规格字符串转换成规格json对象
  })
  list.value = data.list
  total.value = data.total
}
</script>
  
  <style scoped>
.tools-div {
  margin: 10px 0;
  pAddProductSpecing: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.div-atrr {
  pAddProductSpecing: 5px 10px;
  margin: 0 10px;
  background-color: powderblue;
  border-radius: 10px;
}
</style>