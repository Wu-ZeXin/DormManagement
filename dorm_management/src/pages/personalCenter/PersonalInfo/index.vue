<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    <el-breadcrumb-item>个人信息</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-form :model="userForm" ref="userFormRef" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userForm.name" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别" prop="sex">
            <el-input v-model="userForm.sex" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户名" prop="uname">
            <el-input v-model="userForm.uname" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学院" prop="xueyuan">
            <el-input v-model="userForm.xueyuan" clearable :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="班级" prop="banji">
            <el-input v-model="userForm.banji" clearable :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="userForm.tel" clearable :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在楼宇" prop="lynumber">
            <el-input v-model="userForm.lynumber" clearable :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="宿舍号" prop="sushe">
            <el-input v-model="userForm.sushe" clearable :disabled="isModify"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="修改密码" prop="pass">
            <el-input v-model="userForm.pass" clearable :disabled="isModify" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="end">
        <el-button type="warning" size="large" @click="changeModify">修改信息</el-button>
        <el-button type="success" :disabled="isModify" size="large" @click="submit">提交</el-button>
        <el-button type="primary" :disabled="isModify" size="large" @click="cancelModify">取消</el-button>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { markRaw } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { reqUpdateUserData } from "@/api/index"

export default {
  name: 'PersonalInfo',

  data() {
    return {
      userForm: {},

      // 控制是否可修改
      isModify: true,

      ArrowRight: markRaw(ArrowRight)
    }
  },

  created() {
    // 获取存储在会话存储的用户数据
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    // 赋值给userForm
    this.userForm = userData
  },

  methods: {
    changeModify() {
      this.isModify = false
    },

    cancelModify() {
      this.isModify = true
    },

    submit: async function() {
      let _this = this
      try {
        let result = await reqUpdateUserData(this.userForm)
        if(result.data.code == 200) {
          _this.$message({
            type: 'success',
            message: '数据修改成功',
            showClose: true
          })
          sessionStorage.setItem('userData',JSON.stringify(result.data.newResult[0]))
          this.isModify = true
        } else {
          _this.$message({
            showClose: true,
            message: '数据修改失败',
            type: 'error'
          })
        }

      } catch(error) {
        console.log(error);
      }
    }
  }

}
</script>

<style>
</style>