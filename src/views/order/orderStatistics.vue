<template>
  <div class="search-div">
    <el-form label-width="90px" size="small">
      <el-row>
        <el-col :span="18">
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="createTimes"
              type="daterange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button style="margin-left:10px" type="primary" size="small" @click="fetchData()">
            搜索
          </el-button>
          <el-button size="small" @click="reset()">
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div ref="chart" style="width: 100%; height: 100%"></div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { FindOrderTotalAmount } from '@/api/orderStatistics'

const chart = ref()
const searchObj = ref({
  createTimeBegin: '',
  createTimeEnd: '',
})
const createTimes = ref([])

const myChart = ref()

//打开页面后马上执行
onMounted(async () => {
  //初始化Echarts
  myChart.value = echarts.init(chart.value)
  fetchData()
})

//重置
const reset = ()=>{
  createTimes.value = []
  searchObj.value = {}
  fetchData()
}


//加载订单总金额
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    searchObj.value.createTimeBegin = createTimes.value[0]
    searchObj.value.createTimeEnd = createTimes.value[1]
  }
  const { data } = await FindOrderTotalAmount(searchObj.value)

  //显示Echarts图表
  setChartOption(data.dateList, data.amountList)
}

//显示Echarts图表
const setChartOption = (dateList, amountList) => {
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '订单金额统计',
    },
    tooltip: {},
    legend: {
      data: ['订单总金额（元）'],
    },
    xAxis: {
      data: dateList,
    },
    yAxis: {},
    series: [
      {
        name: '订单总金额（元）',
        type: 'bar',
        data: amountList,
      },
    ],
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.value.setOption(option)
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
</style>