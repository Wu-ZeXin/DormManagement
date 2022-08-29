<template>
  <BreadCrumb :firstTitle="'后勤服务'" :secondTitle="'损坏报修'"></BreadCrumb>
  <div class="bg">
    <el-card>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="报修日期" prop="date">
              <el-date-picker
                v-model="addForm.date"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
                :shortcuts="shortcuts"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="报修时间" prop="time">
              <el-time-picker v-model="addForm.time" placeholder="请选择时间" value-format="HH:mm:ss" size="large"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修人" prop="name">
              <el-input placeholder="请输入您的姓名" v-model="addForm.name" size="large"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input placeholder="请输入您的联系电话" v-model="addForm.tel" size="large"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼宇号" prop="lyNumber">
              <el-input placeholder="请输入您所在的楼宇号" v-model="addForm.lyNumber" size="large"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宿舍号" prop="sushe">
              <el-input placeholder="请输入您的宿舍号" v-model="addForm.sushe" size="large"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="detail">
              <el-input
                v-model="addForm.detail"
                type="textarea"
                placeholder="请描述损坏情况"
                :autosize="{ minRows: 2, maxRows: 8 }"
                clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="end">
          <el-button size="large" @click="cancel">取消</el-button>
          <el-button type="primary" size="large" @click="addRepair">添加报修</el-button>
        </el-row>
      </el-form>
      <p class="tip" style="margin-top: 60px;">温馨提示：您好！同学，如有紧急报修项目请与楼管老师联系或者直接拨打后勤集团服务热线：123456</p>
      <p class="tip">如不影响正常学习生活，请填写以上申请表，我们会尽快安排维修人员解决问题，谢谢您的配合！  </p>
    </el-card>
  </div>
</template>

<script>
import { reqAddRepair } from "@/api/index"

export default {
  name: 'DamageRepair',

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
      // 报修添加信息表
      addForm: {
        name: '',
        tel: '',
        lyNumber: '',
        sushe: '',
        date: '',
        time: '',
        detail: ''
      },

      // 报修添加信息表
      addFormRules: {
        name: [
          { required: true, message: '请输入您的姓名', trigger: 'blur' },
          { message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        date: [{ required: true, message: "请选择报修日期", trigger: "blur" }],
        time: [{ required: true, message: "请选择报修时间", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入您的联系电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        lyNumber: [
          { required: true, message: "请填写您所在楼宇号", trigger: "blur" }
        ],
        sushe: [
          { required: true, message: "请填写您所在的宿舍号", trigger: "blur" }
        ],
        detail: [{ required: true, message: "请填写报修详情", trigger: "blur" }]
      },

      // 日期选择器快捷选择项
      shortcuts: [
        {
          text: '今天',
          value: new Date()
        }
      ],
    }
  },

  methods: {
    // 重置添加报修信息
    cancel() {
      this.$refs.addFormRef.resetFields()
    },

    // 添加报修
    addRepair() {
      let _this = this
      this.$refs.addFormRef.validate(async (valid) => {
        if( !valid ) return;
        let result = await reqAddRepair(_this.addForm)
        if( result.data.code == 200 ) {
          _this.$message({
            type: 'success',
            showClose: true,
            message: '添加报修成功'
          })
          _this.$refs.addFormRef.resetFields()
        } else {
          _this.$message({
            type: 'error',
            showClose: true,
            message: '添加报修失败'
          })
        }
      })
    }
  }
}
</script>

<style>
.bg {
  height: 95%;
  background-image: url(@/assets/images/12.jpg);
  background-size: cover;
}

.el-card {
  margin-top: 0;
  opacity: 0.8;
}

.tip {
  text-align: center;
  color: red;
  font-size: 14px;
}
</style>