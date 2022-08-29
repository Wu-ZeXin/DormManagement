<template>
  <BreadCrumb :firstTitle="'统计中心'" :secondTitle="'报修统计'"></BreadCrumb>
  <el-card>
    <el-form  :model="searchForm" class="demo-form-inline" size="large">
      <el-row>
        <el-col :span="6">
          <el-form-item label="楼宇号">
            <el-input v-model="searchForm.lynumber" placeholder="请输入楼宇号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchInfo" :icon="Search" style="margin-left: 30px;">搜索</el-button>
            <el-button type="primary" @click="addDialogFormVisible = true" :icon="Plus" style="margin-left: 30px;">添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="border-card">
      <el-tab-pane label="数据表展示">
        <el-table :data="repairStatistics" border size="large" >
          <el-table-column prop="lynumber" label="楼宇号" />
          <el-table-column prop="name" label="楼管姓名" />
          <el-table-column prop="tel" label="联系电话" width="120"/>
          <el-table-column prop="bxsh" label="报修损耗（元）" sortable width="230" />
          <el-table-column prop="clgm" label="材料购买（元）" sortable width="230" />
          <el-table-column prop="lywh" label="楼宇维护（元）" sortable width="230" />
          <el-table-column prop="total" label="总额（元）" sortable width="230" />
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
  <el-dialog v-model="addDialogFormVisible" title="添加评价">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
      <el-form-item label="楼宇号" prop="lyNumber">
        <el-input v-model="addForm.lyNumber"/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name"/>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="addForm.tel"/>
      </el-form-item>
      <el-form-item label="报修损耗" prop="bxsh">
        <el-input v-model="addForm.bxsh"/>
      </el-form-item>
      <el-form-item label="材料购买" prop="clgm">
        <el-input v-model="addForm.clgm"/>
      </el-form-item>
      <el-form-item label="楼宇维护" prop="lywh">
        <el-input v-model="addForm.lywh"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addRepairStatistic">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { markRaw } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { reqRepairStatistics, reqAddRepairStatistics } from "@/api/index"

export default {
  name: 'ReportStatistics',

  data() {
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      // const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 搜索信息表单
      searchForm: {
        lynumber: '',
        pagenum: 1,
        pagesize: 5
      },

      // 添加保修表单
      addForm: {
        lyNumber: '',
        name: '',
        tel: '',
        bxsh: '',
        clgm: '',
        lywh: ''
      },

      addFormRules: {
        lyNumber: [ { required: true, message: '请填写楼宇号,格式为“新区*号楼”', trigger: 'blur'} ],
        name: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },

      // 判断添加报修统计对话框
      addDialogFormVisible: false,

      // 报修统计数据
      repairStatistics: [],
      // 楼宇号
      buildNum: [],
      // 保修损耗
      repairLoss: [],
      // 材料购买
      materialBuy: [],
      // 楼宇维护
      buildMainten: [],
      // 保修数据总数
      total: 0,
      Search: markRaw(Search),
      Plus: markRaw(Plus)
    }
  },

  created() {
    this.getRepairStatistics()
  },

  methods: {
    // 获取报修统计数据
    async getRepairStatistics() {
      try {
        let result = await reqRepairStatistics(this.searchForm)
        console.log(result)
        if(result.data.code == 200) {
          this.repairStatistics = result.data.data
          this.total = result.data.total
          this.buildNum = result.data.lyh
          this.repairLoss = result.data.bxsh
          this.materialBuy = result.data.clgm
          this.buildMainten = result.data.lywh
          this.drawColumn()
        }
      } catch(error) {
        console.log(error.message)
      }
    },

    handleSizeChange() {
      this.getRepairStatistics()
    },

    handleCurrentChange() {
      this.getRepairStatistics()
    },

    searchInfo() {
      this.getRepairStatistics()
    },

    addRepairStatistic() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return;
        try {
          let result = await reqAddRepairStatistics(_this.addForm)
          if(result.data.code == 200){
            _this.$message({
              type: 'success',
              message: '添加报修统计数据成功',
              showClose: true
            })
            _this.getRepairStatistics()
            _this.addDialogFormVisible = false
          } else {
            _this.$message({
              type: 'warning',
              message: '添加报修统计数据失败',
              showClose: true
            })
          }
        } catch(error) {
          console.log(error.message)
        }

      })
    },

    drawColumn() {
      let myChart = this.$echarts.init(document.getElementById("myChart"))
      myChart.setOption({
        title: {
          text: '保修统计各项数据统计图',
          left: "center",
          top: 'auto'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              type: ['line','bar']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['报修损耗', '材料购买', '楼宇维护'],
          top: "30px"
        },
        xAxis: {
          name: '楼宇号',
          data: this.buildNum,
          axisPointer: {
            type: 'shadow',
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '材料购买',
            position: 'right',
            alignTicks: true,
            min: 0,
            max: 10000,
            interval: 1000,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '楼宇维护',
            position: 'right',
            alignTicks: true,
            offset: 50,
            min: 0,
            max: 10000,
            interval: 1000,
            axisLine: {
              show: true,
              lineStyle: {
                color: "red"
              }
            },
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '报修损耗',
            position: 'left',
            alignTicks: true,
            min: 0,
            max: 10000,
            interval: 1000,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: '报修损耗',
            type: 'bar',
            data: this.repairLoss,
            itemStyle: {
              color: "#C23531"
            }
          },
          {
            name: '材料购买',
            type: 'bar',
            data: this.materialBuy,
            itemStyle: {
              color: "#2F4554"
            }
          },
          {
            name: '楼宇维护',
            type: 'line',
            data: this.buildMainten,
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
  width: 1100px;
  height: 450px;
}
</style>