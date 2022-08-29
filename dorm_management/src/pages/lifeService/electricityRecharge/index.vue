<template>
  <BreadCrumb :firstTitle="'生活服务'" :secondTitle="'电费充值'"></BreadCrumb>
  <el-card>
    <h1>电费查询</h1>
    <el-form :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼宇号" prop="lyNumber">
            <el-input v-model="searchForm.lyNumber" placeholder="请输入你的楼宇号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="宿舍号" prop="sushe">
            <el-input v-model="searchForm.sushe" placeholder="请输入你的宿舍号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="search" size="large" :icon="Search">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse v-model="activeNames" v-if="searchResult">
      <el-collapse-item title="电费查询结果:" name="1">
        <el-form :model="resultForm" label-width="110px" size="large">
          <el-row>
            <el-col :span="8">
              <el-form-item label="楼宇号" prop="lyNumber">
                <el-input v-model="resultForm.lyNumber" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="宿舍号" prop="sushe">
                <el-input v-model="resultForm.sushe" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="余额" prop="balance">
                <el-input v-model="resultForm.balance" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="上次缴费时间" prop="lastTime">
                <el-input v-model="resultForm.lastTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上次缴费金额" prop="lastMoney">
                <el-input v-model="resultForm.lastMoney" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-divider />
    <h1>电费充值</h1>
    <el-form>
      <p>请选择充值金额：</p>
      <el-row>
        <el-col :span="6">
          <el-radio v-model="money" :label="10" border size="large">10元</el-radio>
        </el-col>
        <el-col :span="6">
          <el-radio v-model="money" :label="30" border size="large">30元</el-radio>
        </el-col>
        <el-col :span="6">
          <el-radio v-model="money" :label="50" border size="large">50元</el-radio>
        </el-col>
        <el-col :span="6">
          <el-radio v-model="money" :label="100" border size="large">100元</el-radio>
        </el-col>
      </el-row>
      <el-row justify="center" style="margin: 40px 0;">
        <el-col :span="2">
          <el-button type="primary" round size="large" @click="recharge">充值</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" round size="large" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <el-dialog
    v-model="ChoosePaymentMethod"
    title="请选择支付方式"
    width="50%"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="支付宝支付"><img src="@/assets/images/AlipayPay.jpg" alt="支付宝码"></el-tab-pane>
      <el-tab-pane label="微信支付"><img src="@/assets/images/WechatPay.jpg" alt="微信码"></el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ChoosePaymentMethod = false" size="large">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { markRaw } from "vue"
import { Search } from "@element-plus/icons-vue"

export default {
  name: 'ElectricityRecharge',

  data() {
    return {
      // 表单搜索信息
      searchForm: {
        lyNumber: '',
        sushe: ''
      },

      // 默认要展开的折叠面板
      activeNames: ["1"],
      // 控制电费查询结果面板是否展示
      searchResult: false,
      // 查询结果表单
      resultForm: {
        lyNumber: "新区1号楼",
        sushe: "101",
        balance: "20度电",
        lastTime: "2022-05-28 16:32:15",
        lastMoney: "50元"
      },
      // 充值的金额
      money: "",
      // 控制选择支付方式对话框的显示与隐藏
      ChoosePaymentMethod: false,

      Search: markRaw(Search)
    }
  },

  methods: {
    // 搜索按钮事件
    search() {
      this.searchResult = true
    },

    // 取消选择充值金额
    cancel() {
      this.money = ''
    },

    // 充值
    recharge() {
      if( this.money == '') {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '亲，请您先选择充值金额'
        })
      } else {
        this.ChoosePaymentMethod = true
      }
    }
  },

}
</script>

<style>
h1 {
  font-size: 25px;
  margin-bottom: 15px;
}

p {
  margin-bottom: 15px;
}

.el-tab-pane{
  display: flex;
  justify-content: center;
}

.el-tab-pane img{
  width: 40%;
}
</style>