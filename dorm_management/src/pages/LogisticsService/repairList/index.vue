<template>
  <BreadCrumb :firstTitle="'后勤服务'" :secondTitle="'报修列表'"></BreadCrumb>
  <el-card>
    <el-table :data="repairList" stripe border size="large" height="333">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="楼宇号" prop="lynumber"></el-table-column>
      <el-table-column label="宿舍号" prop="sushe" width="70px"></el-table-column>
      <el-table-column label="报修人" prop="uname" width="90px"></el-table-column>
      <el-table-column label="报修日期" prop="bxdate"></el-table-column>
      <el-table-column label="报修时间" prop="bxtime"></el-table-column>
      <el-table-column label="报修详情" prop="bxdel" width="550px"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.switchon == '0' ? '已处理' : '未处理'"
            placement="top">
            <el-switch v-model="scope.row.switchon" active-value="1" inactive-value="0"
              @change="handleChange(scope.row.id, scope.row.switchon)" />
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
            <el-button size="small" type="danger" @click="deleteItem(scope.row.id)">
              <el-icon>
                <delete />
              </el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="queryList.pagenum" v-model:page-size="queryList.pagesize"
      :page-sizes="[1, 2, 5, 10, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-card>
</template>

<script>
import { reqRepairList, reqChangeSwitch, reqDeleteRepair } from "@/api/index"
import { Delete } from "@element-plus/icons-vue"

export default {
  name: 'RepairList',

  data() {
    return {
      // 分页器信息
      queryList: {
        pagenum: 1,
        pagesize: 5,
      },

      // 报修信息列表
      repairList: [],

      // 总页数
      total: 0,
    }
  },

  created() {
    this.getRepairList()
  },

  methods: {
    // 获取表修列表信息
    async getRepairList() {
      try {
        let result = await reqRepairList(this.queryList)
        if (result.data.code == 200) {
          this.repairList = result.data.data
          this.total = result.data.total
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    handleSizeChange() {
      this.getRepairList()
    },

    handleCurrentChange() {
      this.getRepairList()
    },

    // 改变开关按钮状态
    async handleChange(id, switchon) {
      try {
        let result = await reqChangeSwitch({ id, switchon })
        if (result.data.code == 200) {
          this.$message({
            type: 'success',
            showClose: true,
            message: '状态改变成功'
          })
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // 删除
    deleteItem(id) {
      let _this = this
      _this.$messageBox.confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: async function (action) {
            if( action == 'close' || action == 'cancel') {
              _this.$message('已取消删除')
            } else {
              try {
                let result = await reqDeleteRepair({ id })
                if (result.data.code == 200) {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '删除成功'
                  })
                  _this.getRepairList()
                } else {
                  _this.$message({
                    type: 'error',
                    showClose: true,
                    message: '删除失败'
                  })
                }
              } catch (error) {
                console.log(error.message)
              }
            }

          }
        }
      )


    }
  },

  components: { Delete }
}
</script>

<style>
.el-button {
  margin-left: 15px;
}
</style>