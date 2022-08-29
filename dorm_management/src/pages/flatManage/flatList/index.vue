<template>
  <div>
    <!-- 面包屑导航区 -->
    <BreadCrumb :firstTitle="'楼宇管理'" :secondTitle="'楼宇列表'"></BreadCrumb>
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
            <el-form-item label="姓名">
              <el-input v-model="userName" placeholder="请输入负责人姓名" clearable></el-input>
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
      <el-row>
        <el-col :span="16">
          <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">添加</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload class="upload-demo" action="http://localhost:3000/newly/addexl" :on-change="onChange"
            :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx">
            <el-button type="warning" :icon="FolderAdd">导入</el-button>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <el-button type="warning" :icon="Download" @click="exportToExcel">导出</el-button>
        </el-col>
      </el-row>
      <el-table :data="lyList" stripe border height="285">
        <el-table-column type="index" />
        <el-table-column prop="lynumber" label="楼宇号" />
        <el-table-column prop="leader" label="负责人" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="tel" label="联系电话" />
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
              <el-button type="danger" @click="deleteLyItem(scope.row.id)">
                <el-icon>
                  <delete />
                </el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      <el-dialog v-model="addDialogVisible" title="添加楼宇">
        <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="楼宇号" prop="lynumber">
            <el-input v-model="addForm.lynumber" />
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="addForm.leader" />
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
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="editDialogVisible" title="查看/编辑楼宇详细信息">
        <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="120px">
          <el-form-item label="楼宇号" prop="lynumber">
            <el-input v-model="editForm.lynumber" disabled />
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="editForm.leader" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="editForm.sex" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="editForm.tel" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { markRaw } from "vue";
import {
  ArrowRight,
  Search,
  Plus,
  FolderAdd,
  Download,
  EditPen,
  Delete,
} from "@element-plus/icons-vue";
import {
  reqLyListInfo,
  reqBuildNumber,
  reqBuildHeaderInfo,
  reqAddBuildHeader,
  reqDeleteBuildHeader,
  reqEditBuildHeader,
} from "@/api";

export default {
  name: "FlatList",

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
      // 楼宇信息列表
      lyList: [],

      // 楼宇号信息
      lyNumberList: [],

      // 选择的楼宇号
      lyNumber: "",
      // 负责人姓名
      userName: "",

      // 搜索信息
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 5,
      },
      // 总页数
      total: 0,

      // 决定添加对话框是否显示
      addDialogVisible: false,
      // 添加楼宇的表单数据
      addForm: {
        // 楼宇号
        lynumber: "",
        // 负责人
        leader: "",
        // 性别
        sex: "",
        // 联系电话
        tel: "",
      },
      // 添加楼宇表单的验证规则
      addFormRules: {
        lynumber: [
          { required: true, message: "请输入楼宇号", trigger: "blur" },
        ],
        leader: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },

      // 决定编辑对话框是否显示
      editDialogVisible: false,
      // 添加楼宇的表单数据
      editForm: {
        id: "",
        lynumber: "",
        leader: "",
        sex: "",
        tel: "",
      },
      // 编辑楼宇表单的验证规则
      editFormRules: {
        leader: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },

      // fileData: {},

      // 文件上传的数据
      addexl: [],

      Plus: markRaw(Plus),
      FolderAdd: markRaw(FolderAdd),
      Download: markRaw(Download),
    };
  },

  async created() {
    try {
      // 获取楼宇列表信息
      let lyListInfo = await reqLyListInfo(this.queryInfo);
      if (lyListInfo.data.code == 200) {
        this.lyList = lyListInfo.data.data;
        this.total = lyListInfo.data.total;
      }
    } catch (error) {
      console.log(error.message);
    }

    try {
      // 获取楼宇号信息
      let lyNumberInfo = await reqBuildNumber();
      if (lyNumberInfo.data.code == 200) {
        this.lyNumberList = lyNumberInfo.data.data;
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  methods: {
    // 依据lyNumber、userName中一个或全没查询负责人信息
    async Search() {
      try {
        let data = {
          lynumber: this.lyNumber,
          userName: this.userName,
        };
        let result = await reqBuildHeaderInfo(data);
        console.log(result);
        if (result.data.code == 200) {
          this.lyList = result.data.data;
        } else {
          this.$notify({
            title: "警告",
            message: "抱歉，没有找到任何信息，您可以重新尝试一下",
            type: "warning",
            duration: 2000,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // 分页器页数大小发生变化时
    async handleSizeChange() {
      try {
        // 分页器页数大小变化，重新获取楼宇列表信息
        let lyListInfo = await reqLyListInfo(this.queryInfo);
        if (lyListInfo.data.code == 200) {
          this.lyList = lyListInfo.data.data;
          this.total = lyListInfo.data.total;
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // 分页器当前页发生变化时
    async handleCurrentChange() {
      try {
        let lyListInfo = await reqLyListInfo(this.queryInfo);
        if (lyListInfo.data.code == 200) {
          this.lyList = lyListInfo.data.data;
          this.total = lyListInfo.data.total;
        }
      } catch (error) {
        console.log(error.message);
      }
      // 分页器当前页变化，重新获取楼宇列表信息
    },

    // 添加楼宇信息
    addUser() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        try {
          // 添加楼宇信息请求
          let result = await reqAddBuildHeader(_this.addForm);
          if (result.data.code == 200) {
            _this.$notify({
              type: "success",
              title: "成功",
              message: "添加楼宇信息成功",
            });
            // 添加楼宇信息成功，重新请求新的楼宇数据
            try {
              let lyListInfo = await reqLyListInfo(_this.queryInfo);
              if (lyListInfo.data.code == 200) {
                _this.lyList = lyListInfo.data.data;
                _this.total = lyListInfo.data.total;
                _this.addForm = { lynumber: "", leader: "", sex: "", tel: "" };
              }
            } catch (error) {
              console.log(error.message);
            }
            // 添加楼宇成功后，获取楼宇号信息
            try {
              let lyNumberInfo = await reqBuildNumber();
              if (lyNumberInfo.data.code == 200) {
                _this.lyNumberList = lyNumberInfo.data.data;
              }
            } catch (error) {
              console.log(error.message);
            }
          } else {
            this.$notify({
              type: "error",
              title: "失败",
              message: "添加楼宇信息失败",
            });
          }
          this.addDialogVisible = false;
        } catch (error) {
          console.log(error.message);
        }
      })
    },

    // 删除楼宇负责人信息
    deleteLyItem(id) {
      let _this = this;
      this.$messageBox.confirm(
        "此操作将永久删除该楼宇信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          callback: async function (action) {
            // 点击取消或关闭提示已取消删除
            if (action == "cancel" || action == "close") {
              _this.$message("已取消删除");
            } else {
              // 点击确定，删除楼宇数据
              try {
                let result = await reqDeleteBuildHeader({
                  id,
                  ..._this.queryInfo,
                });
                if (result.data.code == 200) {
                  _this.$message({
                    showClose: true,
                    message: "已删除该楼宇信息",
                    type: "error",
                  });
                  _this.lyList = result.data.newResult;
                  _this.total = result.data.total;
                  // 删除楼宇负责人后重新获取楼宇信息表
                  try {
                    // 获取楼宇号信息
                    let lyNumberInfo = await reqBuildNumber();
                    console.log(lyNumberInfo);
                    if (lyNumberInfo.data.code == 200) {
                      _this.lyNumberList = lyNumberInfo.data.data;
                    }
                  } catch (error) {
                    console.log(error.message);
                  }
                }
              } catch (error) {
                console.log(error.message);
              }
            }
          },
        }
      );
    },

    // 编辑按钮事件，弹出对话框
    editItem(lyHeader) {
      this.editDialogVisible = true;
      this.editForm = lyHeader;
    },

    // 编辑楼宇负责人信息后，提交修改
    editUser() {
      let _this = this
      this.$refs.editFormRef.validate(async (valid) => {
        if( !valid ) return;
        try {
          let result = await reqEditBuildHeader(_this.editForm);
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
    },

    // ----------以下为导入Excel数据功能--------------
    // 文件状态改变时的函数
    onChange(file, fileList) {
      // console.log(file);   // 上传的文件
      // console.log(fileList);   // 上传的文件列表
      if (!file) {
        // 如果没有上传文件
        return false
      } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        // 文件上传格式错误
        this.$message({
          showClose: true,
          type: 'error',
          message: '文件上传格式错误，请上传xls或xlsx格式文件'
        })
      }
      // 文件上传成功，对文件进行处理
      const fileReader = new FileReader()
      fileReader.onload = (evt) => {
        try {
          const data = evt.target.result
          const tableData = this.$xlsx.read(data, {
            type: 'binary'
          })
          console.log(tableData);
          if (tableData.SheetNames.length >= 1) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '导入数据表格成功'
            })
          }
          const tableName = tableData.SheetNames[0]
          // 取第一张表
          const tableDataList = this.$xlsx.utils.sheet_to_json(tableData.Sheets[tableName])
          console.log(tableDataList);
          // 将数据重新压入
          for (let i = 0; i < tableDataList.length; i++) {
            const sheetData = {
              id: tableDataList[i]["id"],
              lynumber: tableDataList[i]["楼宇号"],
              leader: tableDataList[i]["负责人"],
              sex: tableDataList[i]["性别"],
              tel: tableDataList[i]['联系电话']
            }
            console.log(sheetData);
            this.lyList.push(sheetData)
            this.addexl.push(sheetData)
          }
        } catch (error) {
          return false;
        }
      }
      fileReader.readAsBinaryString(file.raw)
    },

    // ----------以下为导出Excel数据功能--------------
    exportToExcel() {
      const tableData = [
        ["id", "楼宇号", "负责人", "性别", "联系电话"]
      ];
      this.lyList.forEach(item => {
        let rowData = []
        rowData = [
          item.id,
          item.lynumber,
          item.leader,
          item.sex,
          item.tel
        ]
        tableData.push(rowData)
      })
      let ws = this.$xlsx.utils.aoa_to_sheet(tableData)
      let wb = this.$xlsx.utils.book_new()
      this.$xlsx.utils.book_append_sheet(wb, ws, '楼宇列表excel') // 工作簿名称
      this.$xlsx.writeFile(wb, '楼宇列表excel.xlsx') // 保存的文件名
    },
  },

  components: {
    Search,
    EditPen,
    Delete,
  },
};
</script>

<style>
.el-button {
  margin-left: 30px;
}
</style>