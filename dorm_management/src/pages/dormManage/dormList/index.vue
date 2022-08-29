<template>
  <BreadCrumb :firstTitle="'宿舍管理'" :secondTitle="'宿舍列表'"></BreadCrumb>
  <!-- 搜索卡片视图区 -->
  <el-card>
    <el-form label-width="60px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼宇号">
            <el-select v-model="lyNumber" placeholder="请选择楼宇号" clearable>
              <el-option v-for="(item, index) in lyNumberList" :key="index" :label="item.lynumber"
                :value="item.lynumber" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="宿舍号">
            <el-input v-model="dormNumber" placeholder="请输入宿舍号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="Search">
              <el-icon>
                <Search />
              </el-icon>
              <span>搜索</span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <!-- 楼宇列表内容区 -->
  <el-card>
    <el-table :data="dormList" stripe border height="285" :row-key="getRowKey" :expand-row-keys="expands">
      <el-table-column type="expand" class="dorm" style="margin: 30px 0">
        <template v-slot="scope">
          <h3 class="dorm-title">{{ scope.row.sushe }}宿舍人员名单</h3>
          <el-table :data="scope.row.child" stripe border height="334" class="dorm-table">
            <el-table-column type="index" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="uname" label="学号" />
            <el-table-column prop="tel" label="电话" />
            <el-table-column prop="fdy" label="辅导员" width="60px" />
            <el-table-column prop="fdytel" label="辅导员电话" />
            <el-table-column prop="xueyuan" label="学院" />
            <el-table-column prop="banji" label="班级" />
            <el-table-column label="操作" width="200px">
              <template v-slot="scope">
                <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                  <el-button type="warning" @click="editItem(scope.row)">
                    <el-icon>
                      <edit-pen />
                    </el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" @click="deleteItem(scope.row.id)">
                    <el-icon>
                      <delete />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="宿舍号" prop="sushe" />
      <el-table-column label="宿舍长" prop="ssz" />
      <el-table-column label="状态" prop="child">
        <template v-slot="scope">
          <el-tag class="ml-2" v-if="scope.row.child.length == 6" type="danger">已满</el-tag>
          <el-tag class="ml-2" v-else>未满</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="scope">
          <el-tooltip class="box-item" effect="dark" content="查看" placement="top">
            <el-button type="success" @click="rowClick(scope.row)">
              <el-icon>
                <el-icon>
                  <View />
                </el-icon>
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="分配学生" placement="top" v-if="scope.row.child.length != 6">
            <el-button type="warning" @click="addInfo(scope.row)">
              <el-icon>
                <Plus />
              </el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog v-model="addDialogVisible" title="分配学生">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="addForm.studentId" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addForm.tel" />
        </el-form-item>
        <el-form-item label="辅导员" prop="fdy">
          <el-input v-model="addForm.fdy" />
        </el-form-item>
        <el-form-item label="辅导员电话" prop="fdytel">
          <el-input v-model="addForm.fdytel" />
        </el-form-item>
        <el-form-item label="学院" prop="xueyuan">
          <el-input v-model="addForm.xueyuan" />
        </el-form-item>
        <el-form-item label="班级" prop="banji">
          <el-input v-model="addForm.banji" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addStudent">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" title="编辑学生信息">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" disabled />
        </el-form-item>
        <el-form-item label="学号" prop="uname">
          <el-input v-model="editForm.uname" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editForm.tel" />
        </el-form-item>
        <el-form-item label="辅导员" prop="fdy">
          <el-input v-model="editForm.fdy" />
        </el-form-item>
        <el-form-item label="辅导员电话" prop="fdytel">
          <el-input v-model="editForm.fdytel" />
        </el-form-item>
        <el-form-item label="学院" prop="xueyuan">
          <el-input v-model="editForm.xueyuan" />
        </el-form-item>
        <el-form-item label="班级" prop="banji">
          <el-input v-model="editForm.banji" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editStudent">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import { reqBuildNumber, reqDormList, reqAddStudent, reqDeleteStudent, reqEditStudent } from "@/api/index"
import { Search, View, Plus, EditPen, Delete } from "@element-plus/icons-vue";
export default {
  name: 'DormManage',

  data() {
    // 添加手机号的验证规则
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
      // 楼宇名字列表
      lyNumberList: [],
      // 选择的楼宇号
      lyNumber: "新区1号楼",
      // 搜索的宿舍号
      dormNumber: '',
      // 搜索信息
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5,
      },
      // 数据总数
      total: 0,
      // Table 目前的展开行
      expands: [],
      // 宿舍列表
      dormList: [],

      // 判断分配学生对话框是否打开
      addDialogVisible: false,
      // 分配学生信息表
      addForm: {
        name: '',
        studentId: '',
        tel: '',
        fdy: '',
        fdytel: '',
        xueyuan: '',
        banji: '',
        sex: '',
        pass: 123456,
        lyid: '',
        sushe: ''
      },
      // 分配学生对话框匹配规则
      addFormRules: {
        name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' },],
        sex: [{ required: true, message: '请输入学生性别', trigger: 'blur' },],
        studentId: [
          { required: true, message: '请输入学生学号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入学生电话', trigger: 'blur' },
          { validator: checkPhone, trigger: "blur" },
        ],
        fdy: [{ required: true, message: '请输入辅导姓名', trigger: 'blur' },],
        fdytel: [
          { required: true, message: '请输入辅导员电话', trigger: 'blur' },
          { validator: checkPhone, trigger: "blur" },
        ],
        xueyuan: [{ required: true, message: '请输入学生所在学院', trigger: 'blur' },],
        banji: [{ required: true, message: '请输入学生所在班级', trigger: 'blur' },]
      },

      // 决定编辑对话框是否显示
      editDialogVisible: false,
      // 添加楼宇的表单数据
      editForm: {
        id: "",
        name: '',
        uname: '',
        tel: '',
        fdy: '',
        fdytel: '',
        xueyuan: '',
        banji: '',
      },
      // 编辑楼宇表单的验证规则
      editFormRules: {
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
    }
  },

  async created() {
    // 获取楼宇列表信息
    try {
      let result = await reqBuildNumber()
      if (result.data.code == 200) {
        this.lyNumberList = result.data.data
      }
    } catch (error) {
      console.log(error.message);
    }

    // 获取宿舍列表信息
    this.getDormListInfo()
  },

  methods: {
    // 获取宿舍列表信息
    async getDormListInfo() {
      try {
        const reqData = {
          lynumber: this.lyNumber,
          ssnumber: this.dormNumber,
          ...this.queryInfo
        }
        let result = await reqDormList(reqData)
        if (result.data.code == 200) {
          this.dormList = result.data.data
          this.total = result.data.pagetotal
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // 搜索获取宿舍列表信息
    Search() {
      this.getDormListInfo()
    },

    // 页数改变时
    handleSizeChange() {
      this.getDormListInfo()
    },

    // 当前页变化时
    handleCurrentChange() {
      this.getDormListInfo()
    },

    // 获取行数id
    getRowKey(row) {
      return (row.id).toString()
    },

    // 查看按钮点击事件展开对应行
    rowClick(row) {
      if ((row.id).toString() === this.expands[0]) {
        //点击另一行的时候，把expands清空。即可把上一行给关闭，展开当前点击行
        this.expands.shift()
      } else {
        this.expands.shift()
        this.expands.push((row.id).toString())
      }
    },


    // 分配学生按钮事件
    addInfo(row) {
      this.addForm.sex = row.sex
      this.addForm.lyid = row.lyid
      this.addForm.sushe = row.sushe
      this.addDialogVisible = true
    },

    // 分配学生确认
    addStudent() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          let result = await reqAddStudent(_this.addForm)
          if (result.data.code == 200) {
            _this.$notify({
              type: 'success',
              message: '分配学生成功',
              showClose: true
            })
            _this.getDormListInfo()
            _this.addDialogVisible = false
          } else {
            _this.$notify({
              type: 'error',
              message: '分配学生失败',
              showClose: true
            })
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    },

    // 从宿舍删除学生
    deleteItem(id) {
      let _this = this
      this.$messageBox.confirm(
        "此操作将永久删除该学生信息, 是否继续?",
        "提示",
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: async function (action) {
            if (action == "cancel" || action == "close") {
              _this.$message("已取消删除")
            } else if (action == "confirm") {
              try {
                let result = await reqDeleteStudent({ id })
                if (result.data.code == 200) {
                  _this.$message({
                    type: 'success',
                    message: '删除成功',
                    showClose: true
                  })
                }

                // 重新获取盖楼宿舍信息
                _this.getDormListInfo()
              } catch (error) {
                console.log(error.message);
              }
            }
          }
        }
      )
    },

    // 编辑学生
    editItem(row) {
      this.editForm = { ...row }
      this.editDialogVisible = true
    },

    // 向服务端提交编辑信息
    async editStudent() {
      let _this = this
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          let result = await reqEditStudent(_this.editForm);
          if (result.data.code == 200) {
            _this.$message({
              type: 'success',
              message: '更新数据成功',
              showClose: true
            })
            _this.editDialogVisible = false
          } else if (result.data.code == 100) {
            _this.$message('与原数据一致')
            _this.editDialogVisible = false
          } else {
            _this.$message({
              type: 'error',
              message: '更新数据失败',
              showClose: true
            })
            _this.editDialogVisible = false
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    }
  },

  components: { Search, View, Plus, EditPen, Delete }
}
</script>

<style lang="scss">
.dorm-title {
  text-align: center;
  margin-top: 20px;
}

.dorm-table {
  width: 90%;
  margin: 20px auto;
}
</style>