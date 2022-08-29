<template>
  <BreadCrumb :firstTitle="'统计中心'" :secondTitle="'宿舍评分'"></BreadCrumb>
  <el-card>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="large">
      <el-row>
        <el-col :span="5">
          <el-form-item label="楼宇号">
            <el-input v-model="searchForm.lynumber" placeholder="请输入楼宇号" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="宿舍号">
            <el-input v-model="searchForm.sushe" placeholder="请输入宿舍号" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="学院">
            <el-input v-model="searchForm.xueyuan" placeholder="请输入学院名称" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="班级">
            <el-input v-model="searchForm.banji" placeholder="请输入班级名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="searchScore" :icon="Search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="border-card">
      <el-tab-pane label="数据表展示">
        <el-table :data="dormScoreList" border size="large" height="384">
          <el-table-column prop="lynumber" label="楼宇号" />
          <el-table-column prop="sushe" label="宿舍号" width="70" />
          <el-table-column prop="xueyuan" label="学院" />
          <el-table-column prop="banji" label="班级" />
          <el-table-column prop="time" label="时间" sortable width="250" />
          <el-table-column prop="health" label="卫生（分）" sortable width="120" />
          <el-table-column prop="discipline" label="纪律（分）" sortable width="120" />
          <el-table-column prop="dormitoryculture" label="宿舍文化（分）" sortable width="250" />
          <el-table-column prop="total" label="总分（分）" sortable width="120" />
        </el-table>
        <el-pagination v-model:currentPage="searchForm.pagenum" v-model:page-size="searchForm.pagesize"
          :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </el-tab-pane>
      <el-tab-pane label="统计图展示">
        <!-- 数据统计图 -->
        <div id="myChart"></div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { markRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { reqDormScoreList } from '@/api/index'

export default {
  name: 'DormitoryScore',

  data() {
    return {
      // 搜索信息表单
      searchForm: {
        lynumber: '',
        sushe: '',
        xueyuan: '',
        banji: '',
        pagenum: 1,
        pagesize: 5
      },

      // 宿舍评分表数据
      dormScoreList: [],

      // 宿舍号
      sushe: [],
      // 卫生分
      health: [],
      // 纪律分
      discipline: [],
      // 文化分
      culture: [],
      // 宿舍评分表总数
      total: 0,

      Search: markRaw(Search)
    }
  },
  created() {
    this.getDormScoreList()
  },

  methods: {
    // 获取宿舍评分表数据
    async getDormScoreList() {
      try {
        let result = await reqDormScoreList(this.searchForm)
        if (result.data.code == 200) {
          this.dormScoreList = result.data.data
          this.total = result.data.total
          this.sushe = result.data.ssh
          this.health = result.data.wsf
          this.discipline = result.data.jlf
          this.culture = result.data.whf
          this.drawColumn()
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    searchScore() {
      this.getDormScoreList()
    },

    handleSizeChange() {
      this.getDormScoreList()
    },

    handleCurrentChange() {
      this.getDormScoreList()
    },

    drawColumn() {
      let myChart = this.$echarts.init(document.getElementById('myChart'));
      myChart.setOption({
        title: {
          text: '宿舍评分各项数据统计图',
          left: "center",
          top: "auto"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              type: ['line', 'bar']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['卫生', '纪律', '宿舍文化'],
          top: '30px'
        },
        xAxis: {
          name: '宿舍号',
          data: this.sushe,
          axisPointer: {
            type: 'shadow',
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '纪律',
            position: 'right',
            alignTicks: true,
            min: 0,
            max: 10,
            interval: 2,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} 分'
            }
          },
          {
            type: 'value',
            name: '宿舍文化',
            position: 'right',
            alignTicks: true,
            offset: 50,
            min: 0,
            max: 10,
            interval: 2,
            axisLine: {
              show: true,
              lineStyle: {
                color: "red"
              }
            },
            axisLabel: {
              formatter: '{value} 分'
            }
          },
          {
            type: 'value',
            name: '卫生',
            position: 'left',
            alignTicks: true,
            min: 0,
            max: 10,
            interval: 2,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} 分'
            }
          }
        ],
        series: [
          {
            name: '卫生',
            type: 'bar',
            data: this.health,
            itemStyle: {
              color: "#C23531"
            }
          },
          {
            name: '纪律',
            type: 'bar',
            data: this.discipline,
            itemStyle: {
              color: "#2F4554"
            }
          },
          {
            name: '宿舍文化',
            type: 'line',
            data: this.culture,
            itemStyle: {
              color: "#6CA7AE"
            }
          },
        ]
      })
    }
  }
}
</script>

<style>
#myChart {
  width: 950px;
  height: 450px;
}
</style>