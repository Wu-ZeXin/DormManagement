<template>
  <BreadCrumb :firstTitle="'统计中心'" :secondTitle="'楼管评价'"></BreadCrumb>
  <el-card>
    <el-form  :model="searchForm" class="demo-form-inline" size="large" label-width="60px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="楼宇号">
            <el-input v-model="searchForm.lynumber" placeholder="请输入楼宇号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入楼管姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchInfo" :icon="Search" style="margin-left: 30px;">查询</el-button>
            <el-button type="primary" @click="addDialogFormVisible = true" :icon="Plus" style="margin-left: 30px;">添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="border-card">
      <el-tab-pane label="数据表展示">
        <el-table :data="buildTube" border size="large" >
          <el-table-column prop="lynumber" label="楼宇号" />
          <el-table-column prop="name" label="楼管姓名" />
          <el-table-column prop="time" label="评分时间" sortable width="300" />
          <el-table-column prop="pgf" label="品格（分）" sortable/>
          <el-table-column prop="fwf" label="服务（分）" sortable/>
          <el-table-column prop="zrx" label="责任心（分）" sortable width="300"/>
          <el-table-column prop="total" label="总分（分）" sortable  />
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
      <el-form-item label="评分日期" prop="data">
        <el-date-picker
          v-model="addForm.data"
          type="datetime"
          placeholder="请选择日期"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="评分时间" prop="time">
        <el-time-picker v-model="addForm.time" placeholder="请选择时间" value-format="HH:mm:ss"/>
      </el-form-item>
      <el-form-item label="品格" prop="pgf">
        <el-input v-model="addForm.pgf"/>
      </el-form-item>
      <el-form-item label="服务" prop="fwf">
        <el-input v-model="addForm.fwf"/>
      </el-form-item>
      <el-form-item label="责任心" prop="zrx">
        <el-input v-model="addForm.zrx"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addBuildTube">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { markRaw } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { reqBuildTube, reqAddBuildTube } from "@/api/index"

export default {
  name: 'BuildTubeEvaluat',

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
        name: '',
        pagenum: 1,
        pagesize: 5
      },

      // 添加保修表单
      addForm: {
        lyNumber: '',
        name: '',
        pgf: '',
        fwf: '',
        zrx: '',
        time: '',
        data: ''
      },

      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        data: [{ required: true, message: "请选择评分日期", trigger: "blur" }],
        time: [{ required: true, message: "请选择评分时间", trigger: "blur" }],
        fwf: [ { required: true, message: "请填写服务分", trigger: "blur" }],
        zrx: [ { required: true, message: "请填写责任心分", trigger: "blur" }],
        pgf: [ { required: true, message: "请填写品格分", trigger: "blur" }],
        lyNumber: [{ required: true, message: "请填写楼宇号,格式为“新区*号楼”", trigger: "blur" }]
      },

      // 判断添加报修统计对话框
      addDialogFormVisible: false,

      // 报修统计数据
      buildTube: [],
      // 楼管姓名
      tubeName: [],
      // 品格分
      character: [],
      // 服务分
      service: [],
      // 责任心
      responsibility: [],
      // 保修数据总数
      total: 0,

      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        }
      ],

      Search: markRaw(Search),
      Plus: markRaw(Plus)
    }
  },

  created() {
    this.getBuildTube()
  },

  methods: {
    // 获取报修统计数据
    async getBuildTube() {
      try {
        let result = await reqBuildTube(this.searchForm)
        console.log(result)
        if(result.data.code == 200) {
          this.buildTube = result.data.data
          this.total = result.data.total
          this.tubeName = result.data.lgname
          this.character = result.data.pgf
          this.service = result.data.fwf
          this.responsibility = result.data.zrx
          this.drawColumn()
        }
      } catch(error) {
        console.log(error.message)
      }
    },

    handleSizeChange() {
      this.getBuildTube()
    },

    handleCurrentChange() {
      this.getBuildTube()
    },


    searchInfo() {
      this.getBuildTube()
    },

    addBuildTube() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return;
        try {
          let result = await reqAddBuildTube(_this.addForm)
          if(result.data.code == 200){
            _this.$message({
              type: 'success',
              message: '添加楼管评价数据成功',
              showClose: true
            })
            _this.getBuildTube()
            _this.addDialogFormVisible = false
          } else {
            _this.$message({
              type: 'warning',
              message: '添加楼管评价数据失败',
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
          text: '楼管评价各项数据统计图',
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
          data: ['品格分', '服务分', '责任心'],
          top: "30px"
        },
        xAxis: {
          name: '姓名',
          data: this.tubeName,
          axisPointer: {
            type: 'shadow',
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '服务分',
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
            name: '责任心',
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
            name: '品格分',
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
            name: '品格分',
            type: 'bar',
            data: this.character,
            itemStyle: {
              color: "#C23531"
            }
          },
          {
            name: '服务分',
            type: 'bar',
            data: this.service,
            itemStyle: {
              color: "#2F4554"
            }
          },
          {
            name: '责任心',
            type: 'line',
            data: this.responsibility,
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
  width: 1000px;
  height: 450px;
}
</style>