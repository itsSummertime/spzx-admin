<template>
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="6">
          <el-form-item label="品牌">
            <el-select
              class="m-2"
              placeholder="选择品牌"
              size="small"
              style="width: 100%"
              v-model="queryDto.brandId"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="分类">
            <el-cascader
              :props="categoryProps"
              v-model="categoryIds"
              style="width: 100%"
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

  <div class="tools-div">
    <el-button type="success" size="small" @click="showAdd">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="categoryName" label="分类" />
    <el-table-column prop="brandName" label="品牌" />
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50" />
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
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

  <!-- 添加或修改的弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌">
        <el-select
          class="m-2"
          placeholder="选择品牌"
          size="small"
          v-model="categoryBrand.brandId"
        >
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
          :props="categoryProps"
          v-model="categoryBrand.categoryId"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, triggerRef } from 'vue'
import {
  FindCategoryBrandByPage,
  AddCategoryBrand,
  UpdateCategoryBrand,
  DeleteCategoryBrand,
} from '@/api/categoryBrand'
import { FindAllBrand } from '@/api/brand'
import { FindNextList, FindParentList } from '@/api/category'
import { ElMessage, ElMessageBox } from 'element-plus'

// ================数据模型定义  start ===============================================
//添加或修改的弹窗>>>>>>
//是否显示
const dialogVisible = ref(false)
//标题
const dialogTitle = ref('')
//提交的对象
const categoryBrand = ref({})

// 所有品牌
const brandList = ref([])
// 查询条件
const queryDto = ref({})
// 当前页码
const pageNum = ref(1)
// 每页行数
const pageSize = ref(5)
// 分类品牌的列表
const list = ref([])
// 分类品牌的总数
const total = ref(0)
// 分类的级联选择框双向绑定的数据
const categoryIds = ref({})

// 分类的级联选择框绑定的属性
const categoryProps = ref({
  lazy: true, //懒加载，点击后才加载数据
  value: 'id', //选中值的id
  label: 'name', //显示的属性
  leaf: 'leaf', //是否为叶子节点
  async lazyLoad(node, resolve) {
    // 刚进入当前页面时，未选择分类，则查询第一级分类
    node.value = !node.value ? 0 : node.value

    // 加载分类数据
    const { code, data } = await FindNextList(node.value)
    if (code === 200) {
      data.forEach(item => {
        //有子节点，那就不是叶子节点
        item.leaf = !item.hasChildren
      })

      // 在下一级显示数据
      resolve(data)
    }
  },
})

//======   数据模型定义end========================================================

// 页面打开后马上执行
onMounted(() => {
  //加载所有品牌
  loadBrandList()

  //分页查询 - 分类品牌
  fetchData()
})

//逻辑删除
const deleteById = id => {
  ElMessageBox.confirm('此操作将删除该数据. 确定?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteCategoryBrand(id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {})
}

// 显示修改的弹窗
const showUpdate =  async (row)=>{
    //显示弹窗、修改标题、回显数据
    dialogVisible.value = true
    dialogTitle.value = '修改分类品牌'
    categoryBrand.value = {...row}

    //级联选择框的回显-分类
    const {code,data} = await FindParentList(row.categoryId)
    if(code === 200){
        categoryBrand.value.categoryId = data
    }
}

// 弹窗的提交按钮
const saveOrUpdate = async()=>{
    //提取第三级分类的id
    categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]

    if(categoryBrand.value.id){
        //有id，执行修改
        var {code} = await UpdateCategoryBrand(categoryBrand.value)
    }else{
        //没有id，执行添加
        var {code} = await AddCategoryBrand(categoryBrand.value)
    }

    if(code === 200){
        ElMessage.success('操作成功')
        dialogVisible.value = false
        fetchData()
    }
}

//显示添加的弹窗
const showAdd = ()=>{
    //显示弹窗、修改标题、清空表单
    dialogVisible.value = true
    dialogTitle.value = '添加分类品牌'
    categoryBrand.value = {}
}

//重置
const reset = ()=>{
    queryDto.value = {}
    categoryIds.value = {}
    fetchData()
}

//分页查询 - 分类品牌
const fetchData = async () => {
  //提取第三级分类的id
  queryDto.value.categoryId = categoryIds.value['2']

  //发送ajax请求
  const { code, data } = await FindCategoryBrandByPage(
    pageNum.value,
    pageSize.value,
    queryDto.value
  )
  if (code === 200) {
    list.value = data.list
    total.value = data.total
  }
}

//加载所有品牌
const loadBrandList = async () => {
  const { code, data } = await FindAllBrand()
  if (code === 200) {
    brandList.value = data
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