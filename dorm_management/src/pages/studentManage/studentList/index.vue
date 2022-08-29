<template>
  <BreadCrumb :firstTitle="'学生管理'" :secondTitle="'学生列表'"></BreadCrumb>
  <el-card>
    <el-form :model="searchList" label-width="60px" size="large">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学号">
            <el-input v-model="searchList.studentNumber" placeholder="请输入学生学号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="searchList.studentName" placeholder="请输入学生姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="宿舍号">
            <el-input v-model="searchList.susheNumber" placeholder="请输入宿舍号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="楼宇">
            <el-input v-model="searchList.lyNumber" placeholder="请输入楼宇号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="学院">
            <el-input v-model="searchList.xueyuan" placeholder="请输入学院" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="班级">
            <el-input v-model="searchList.className" placeholder="请输入班级名字" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getStuList">
            <el-icon>
              <Search />
            </el-icon>搜索
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogFormVisible = true">
            <el-icon>
              <Plus />
            </el-icon>添加
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-upload class="upload-demo" action="http: //localhost:3000/xslb/addexl" :on-change="handleChange"
            accept=".xls, .xlsx" :auto-upload="false" :show-file-list="false">
            <el-button type="warning">
              <el-icon>
                <FolderAdd />
              </el-icon>
              批量导入
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <el-button type="warning" @click="exportToExcel">
            <el-icon>
              <Download />
            </el-icon>
            批量导出
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <el-card>
    <el-table :data="stuList" stripe border size="large" height="297">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="name" width="90px"></el-table-column>
      <el-table-column label="学号" prop="uname"></el-table-column>
      <el-table-column label="性别" prop="sex" width="60px"></el-table-column>
      <el-table-column label="联系电话" prop="tel"></el-table-column>
      <el-table-column label="学院" prop="xueyuan"></el-table-column>
      <el-table-column label="班级" prop="banji"></el-table-column>
      <el-table-column label="楼宇号" prop="lynumber"></el-table-column>
      <el-table-column label="宿舍号" prop="sushe"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" content="查看/编辑学生信息" placement="top">
            <el-button size="small" type="warning" @click="editItem(scope.row)">
              <el-icon>
                <EditPen />
              </el-icon>
            </el-button>
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
  <el-dialog v-model="addDialogFormVisible" title="添加学生">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="125px">
      <el-form-item label="姓名" prop="stuName">
        <el-input v-model="addForm.stuName" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="addForm.sex" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="addForm.tel" />
      </el-form-item>
      <el-form-item label="学号" prop="stuNumber">
        <el-input v-model="addForm.stuNumber" />
      </el-form-item>
      <el-form-item label="学院" prop="xueyuan">
        <el-input v-model="addForm.xueyuan" />
      </el-form-item>
      <el-form-item label="班级" prop="banji">
        <el-input v-model="addForm.banji" />
      </el-form-item>
      <el-form-item label="楼宇号" prop="lyNumber">
        <el-input v-model="addForm.lyNumber" />
      </el-form-item>
      <el-form-item label="宿舍号" prop="sushe">
        <el-input v-model="addForm.sushe" />
      </el-form-item>
      <el-form-item label="辅导员" prop="fdy">
        <el-input v-model="addForm.fdy" />
      </el-form-item>
      <el-form-item label="辅导员电话" prop="fdytel">
        <el-input v-model="addForm.fdytel" />
      </el-form-item>
      <el-form-item label="紧急联系人" prop="family">
        <el-input v-model="addForm.family" />
      </el-form-item>
      <el-form-item label="紧急联系人电话" prop="familytel">
        <el-input v-model="addForm.familytel" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addStuToList">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogFormVisible" title="修改学生" width="90%">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学号" prop="uname">
            <el-input v-model="editForm.uname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别" prop="sex">
            <el-input v-model="editForm.sex" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="editForm.tel" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="学院" prop="xueyuan">
            <el-input v-model="editForm.xueyuan" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级" prop="banji">
            <el-input v-model="editForm.banji" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在楼宇" prop="lynumber">
            <el-input v-model="editForm.lynumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在宿舍" prop="sushe">
            <el-input v-model="editForm.sushe" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="紧急联系人" prop="family">
            <el-input v-model="editForm.family" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="紧急联系人电话" prop="familytel">
            <el-input v-model="editForm.familytel" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="辅导员" prop="fdy">
            <el-input v-model="editForm.fdy" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="辅导员电话" prop="fdytel">
            <el-input v-model="editForm.fdytel" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editStuToList">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { FolderAdd, Download, Search, Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { reqStuList, reqAddStuToList, reqDeleteStuList, reqEditStuList } from "@/api/index"

export default {
  name: 'StudentManage',

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
      // 学生搜索信息列表
      searchList: {
        studentNumber: '',
        studentName: '',
        susheNumber: '',
        xueyuan: '',
        lyNumber: '',
        className: '',
      },

      // 搜索信息
      queryList: {
        // 当前页
        pagenum: 1,
        // 每页数据条数
        pagesize: 5
      },

      // 学生搜索信息列表
      stuList: [],
      // 学生信息总数
      total: 0,

      // 添加学生信息表
      addForm: {
        pass: 123456,
        state: 1,
        stuNumber: '',
        stuName: '',
        tel: '',
        sex: '',
        sushe: '',
        xueyuan: '',
        banji: '',
        lyNumber: '',
        fdy: '',
        fdytel: '',
        family: '',
        familytel: ''
      },

      // 学生信息表校验规则
      addFormRules: {
        stuNumber: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        stuName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        sushe: [{ required: true, message: '请填写宿舍号，例如101', trigger: 'blur' }],
        xueyuan: [{ required: true, message: '请填写学院名字', trigger: 'blur' }],
        banji: [{ required: true, message: '请填写班级名称', trigger: 'blur' }],
        lyNumber: [{ required: true, message: '请填写楼宇号,格式为“新区*号楼”', trigger: 'blur' }],
        fdy: [{ required: true, message: '请填写辅导员姓名', trigger: 'blur' }],
        fdytel: [
          { required: true, message: '请填写辅导员电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        family: [{ required: true, message: '请填写紧急联系人姓名', trigger: 'blur' }],
        familytel: [
          { required: true, message: '请填写紧急联系人电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
      },

      // 决定添加学生对话框是否显示
      addDialogFormVisible: false,

      // 编辑学生信息表
      editForm: {
        id: '',
        uname: '',
        name: '',
        tel: '',
        sex: '',
        sushe: '',
        xueyuan: '',
        banji: '',
        lyNumber: '',
        fdy: '',
        fdytel: '',
        family: '',
        familytel: ''
      },

      // 编辑学生信息表校验规则
      editFormRules: {
        tel: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        fdytel: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        familytel: [
          { validator: checkPhone, trigger: 'blur' }
        ],
      },

      // 决定编辑学生对话框是否显示
      editDialogFormVisible: false,
    }
  },

  created() {
    this.getStuList()
  },

  methods: {
    // 获取学生列表信息
    async getStuList() {
      try {
        let result = await reqStuList({ ...this.searchList, ...this.queryList })
        if (result.data.code == 200) {
          this.stuList = result.data.data
          this.total = result.data.total
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    handleSizeChange() {
      this.getStuList()
    },

    handleCurrentChange() {
      this.getStuList()
    },

    // 添加学生
    addStuToList() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          let result = await reqAddStuToList(_this.addForm)
          if (result.data.code == 200) {
            _this.$message({
              type: "success",
              message: '添加学生成功',
              showClose: true
            })
            _this.getStuList()
            _this.addDialogFormVisible = false
            _this.addForm = {
              pass: 123456,
              state: 1,
              stuNumber: '',
              stuName: '',
              tel: '',
              sex: '',
              sushe: '',
              xueyuan: '',
              banji: '',
              lyNumber: '',
              fdy: '',
              fdytel: '',
              family: '',
              familytel: ''
            }
          } else {
            _this.$message({
              type: "error",
              message: '添加学生失败',
              showClose: true
            })
            _this.addDialogFormVisible = false
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    },

    // 文件导入事件
    handleChange(file, fileList) {
      // file: 上传的文件    fileList: 上传的文件列表
      // 判断文件是否存在以及文件格式是否符合要求
      if (!file) {
        return false
      } else if (!/\.(xls|xlsx)$/.test(file.raw.name.toLowerCase())) {
        this.$message({
          type: 'success',
          showClose: true,
          message: '文件上传格式错误，请上传xls或xlsx格式文件'
        })
      }
      // 文件存在且文件格式正确，开始处理文件数据
      /*
        1.创建FileReader类
        2.调用FileReader类的读取方法读取上传的文件数据
        3.设置FileReader的onload的回调函数 onload = (evt) => {}
          (1)在onload事件使用`result`属性，拿到文件内容
          (2)调用SheetJs的read方法，read(data, option)
             data: 读取的数据  option: 读取数据的配置(如type: 'binary'   以什么样的格式去读取数据)
          (3)依据SheetJs的read方法读取的数据判断文件是否存在以及做相应的操作，
             并且获取所要读取数据的表名
          (3)调用SheetJs的utils类的sheet_to_json方法依据表名读取数据并将其转换成json格式
          (4)对数据开始进行处理
      */
      const fileReader = new FileReader()
      fileReader.readAsBinaryString(file.raw)
      fileReader.onload = (evt) => {
        const data = evt.target.result
        const tableData = this.$xlsx.read(data, {
          type: 'binary'
        })
        // console.log(tableData);
        if (tableData.SheetNames.length >= 1) {
          this.$message({
            type: 'success',
            showClose: true,
            message: '导入数据表格成功'
          })
        }
        const tableName = tableData.SheetNames[0]
        const tableDataList = this.$xlsx.utils.sheet_to_json(tableData.Sheets[tableName])
        for (let i = 0; i < tableDataList.length; i++) {
          let tempData = {
            id: tableDataList[i]["id"],
            uname: tableDataList[i]["学号"],
            name: tableDataList[i]["姓名"],
            sex: tableDataList[i]["性别"],
            tel: tableDataList[i]["联系电话"],
            xueyuan: tableDataList[i]["学院"],
            banji: tableDataList[i]["班级"],
            lynumber: tableDataList[i]["楼宇号"],
            sushe: tableDataList[i]["宿舍号"],
          }
          this.stuList.push(tempData)
        }
      }
    },

    // 文件导出事件
    exportToExcel() {
      const tableData = [
        ['id', '学号', '姓名', '性别', '联系电话', '宿舍号', '学院', '班级', '楼宇号']
      ]
      this.stuList.forEach(item => {
        const tempData = [
          item.id, item.uname, item.name, item.sex, item.tel, item.sushe, item.xueyuan, item.banji, item.lynumber
        ]
        tableData.push(tempData)
      })
      const ws = this.$xlsx.utils.aoa_to_sheet(tableData)   // 依据数据创建工作表
      const wb = this.$xlsx.utils.book_new()  // 创建一个工作簿
      this.$xlsx.utils.book_append_sheet(wb, ws, '学生列表execl')  // 将工作表插入工作簿中，并命名
      this.$xlsx.writeFile(wb, "学生列表execl.xlsx")  // 创建xlsx文件，并将工作簿写入到xlsx文件
    },

    editItem(user) {
      this.editDialogFormVisible = true
      const { id, uname, name, tel, sex, sushe, xueyuan, banji, lynumber, fdy, fdytel, family, familytel } = { ...user }
      this.editForm = { id, uname, name, tel, sex, sushe, xueyuan, banji, lynumber, fdy, fdytel, family, familytel }
    },

    deleteItem(id) {
      let _this = this
      this.$messageBox.confirm(
        '此操作将永久删除该学生信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: async function (action) {
            if (action == 'close' || action == 'cancel') {
              _this.$message('已取消删除')
            } else if (action == 'confirm') {
              try {
                let result = await reqDeleteStuList({ id })
                if (result.data.code == 200) {
                  _this.$message({
                    type: 'success',
                    showClose: true,
                    message: '删除成功'
                  })
                  _this.getStuList()
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
    },

    editStuToList() {
      let _this = this
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false;
        try {
          let result = await reqEditStuList(_this.editForm)
          if (result.data.code == 100) {
            _this.$message('与原数据一致')
            _this.editDialogFormVisible = false
          } else if (result.data.code == 0) {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '修改失败'
            })
            _this.editDialogFormVisible = false
          } else {
            _this.$message({
              type: 'success',
              showClose: true,
              message: '修改成功'
            })
            _this.getStuList()
            _this.editDialogFormVisible = false
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    }
  },

  components: { FolderAdd, Download, Search, Plus, EditPen, Delete }
}
</script>

<style>
.el-col .el-button {
  margin-left: 30px;
}

.el-icon {
  font-size: 16px;
  margin-right: 5px;
}
</style>