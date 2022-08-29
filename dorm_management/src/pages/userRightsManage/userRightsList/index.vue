<template>
  <BreadCrumb :firstTitle="'用户权限管理'" :secondTitle="'用户权限列表'"></BreadCrumb>
  <el-card>
    <!-- 搜索添加区域 -->
    <el-row :gutter="30">
      <el-col :span="8">
        <el-input v-model="queryInfo.query" placeholder="请输入姓名" class="input-with-select" size="large">
          <template #append>
            <el-button :icon="Search" @click="SearchUser" />
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="large" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 内容表格 -->
    <el-table :data="userList" border stripe height="383">
      <el-table-column type="index" />
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex"></el-table-column>
      <el-table-column label="联系电话" prop="tel"></el-table-column>
      <el-table-column label="角色" prop="roler" :formatter="formatRole"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-tooltip class="box-item" effect="dark" content="修改" placement="top">
            <el-button type="primary" @click="edit(scope.row)">
              <el-icon>
                <EditPen />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
            <el-button type="danger" @click="deleteUser(scope.row.id)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 7, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog v-model="addDialogVisible" title="添加用户">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px" size="large">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="addForm.telephone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="0" />
            <el-option label="普通管理员" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" title="修改用户">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px" size="large">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="editForm.tel" />
        </el-form-item>
        <el-form-item label="角色" prop="roler">
          <el-select v-model="editForm.roler" placeholder="请选择角色">
            <el-option label="超级管理员" value="0" />
            <el-option label="普通管理员" value="1" />
          </el-select>
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
</template>

<script>
import { markRaw } from "vue"
import { Search, EditPen, Delete } from '@element-plus/icons-vue'

import { reqUserList, reqAddUser, reqDeleteUser, reqEditUser } from "@/api/index"

export default {
  name: 'UserRightsManage',

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
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前页每页显示多少条数据
        pagesize: 7,
      },

      // 用户数据列表
      userList: [],

      // 分页总数
      total: 0,


      // 用来判断是否显示添加用户对话框
      addDialogVisible: false,
      // 添加用户表单
      addForm: {
        userName: '',
        sex: '',
        telephone: '',
        role: ''
      },
      // 添加表单校验规则
      addFormRules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: "blur" }
        ],
        role: [{ required: true, trigger: 'blur' }],
      },

      // 用来判断是否显示添加用户对话框
      editDialogVisible: false,
      // 添加用户表单
      editForm: {
        name: '',
        sex: '',
        tel: '',
        roler: ''
      },
      // 添加表单校验规则
      editFormRules: {
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: "blur" }
        ],
      },

      Search: markRaw(Search)
    }
  },

  created() {
    this.getUserList()
  },

  methods: {
    // 请求用户列表数据
    async getUserList() {
      try {
        let result = await reqUserList(this.queryInfo)
        if (result.data.code == 200) {
          this.userList = result.data.data
          this.total = result.data.total
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // 返回管理员角色
    formatRole(row) {
      return row.roler == '0' ? "超级管理员" : "普通管理员"
    },

    SearchUser() {
      this.getUserList()
    },

    // 每页数据条数变化事件
    handleSizeChange() {
      this.getUserList()
    },

    // 当前页变化事件
    handleCurrentChange() {
      this.getUserList()
    },

    // 添加用户
    addUser() {
      let _this = this
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return;
        try {
          let result = await reqAddUser(this.addForm)
          if (result.data.code == 200) {
            this.$notify({
              title: '成功',
              message: '添加用户成功',
              type: 'success'
            })
            this.getUserList()
            this.addDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: '添加用户失败',
              type: 'error'
            })
          }
        } catch (error) {
          console.log(error.message);
        }
      })
    },

    // 删除用户
    deleteUser(id) {
      let _this = this
      this.$messageBox.confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: async function(action) {
            try {
              if( action == "cancel" || action == "close" ) {
                _this.$message("已取消删除")
              } else if(action == "confirm") {
                let result = await reqDeleteUser({id})
                if( result.data.code == 200 ) {
                  _this.$notify({
                    title: '成功',
                    type: 'success',
                    message: '删除用户成功'
                  })
                  _this.getUserList()
                } else {
                  _this.$notify({
                    title: '失败',
                    type: 'error',
                    message: '删除用户失败'
                  })
                }
              }
            } catch(error) {
              console.log(error.message);
            }
          }
        }
      )
    },

    // 点击编辑按钮事件
    edit(row) {
      this.editForm = row
      this.editDialogVisible = true
    },

    // 修改用户
    editUser() {
      let _this = this
      this.$refs.editForm.validate(async (valid) => {
        if( !valid ) return;
        try {
          let result = await reqEditUser(_this.editForm)
          if( result.data.code == 200 ) {
            _this.$message({
              type: 'success',
              showClose: true,
              message: '更新用户数据成功'
            })
            _this.getUserList()
            _this.editDialogVisible = false
          } else if( result.data.code == 100) {
            _this.$message("与原数据一致")
            _this.editDialogVisible = false
          } else {
            _this.$message({
              type: 'error',
              showClose: true,
              message: '更新用户数据失败'
            })
            _this.editDialogVisible = false
          }
        } catch(error){
          console.log(error.message)
        }
      })
    }

  },

  components: {
    EditPen, Delete
  }
}
</script>

<style>
</style>