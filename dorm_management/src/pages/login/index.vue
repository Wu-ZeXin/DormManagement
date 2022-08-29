<template>
  <div class="login">
    <h1>宿舍管理系统</h1>
    <div class="loginBox">
      <!-- logo区域 -->
      <div class="loginLogo">
        <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F17%2F15%2F59aec2f98aab1_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664179037&t=5a46a7494bf7393ad04095a41dfbbe85" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="rules"
        class="login_form"
        ref="loginFormRef"
      >
        <el-form-item prop="name" class="form_item">
          <el-input
            v-model="loginForm.name"
            placeholder="请输入用户名"
            :prefix-icon="Avatar"
          />
        </el-form-item>
        <el-form-item prop="password" class="form_item">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { Avatar, Lock } from "@element-plus/icons-vue";
import { reqLoginInfo } from "@/api/index";

export default {
  name: "Login",

  data() {
    return {
      loginForm: {
        name: "",
        password: "",
      },

      rules: {
        name: [
          {
            required: true,
            message: "用户名输入错误或不存在",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],

        password: [
          { required: true, message: "请输入合法的密码", trigger: "blur" },
        ],
      },

      Avatar: markRaw(Avatar),
      Lock: markRaw(Lock),
    };
  },

  methods: {
    // 重置数据表单
    reset() {
      this.$refs.loginFormRef.resetFields();
    },

    login() {
      let _this = this;
      this.$refs.loginFormRef.validate(async function (valid) {
        // 如果校验失败则返回
        if (!valid) return;
        // 如果校验成功就发送请求
        try {
          let result = await reqLoginInfo(_this.loginForm);
          if (result.data.code == 200) {
            _this.$message({
              showClose: true,
              message: '登陆成功',
              type: 'success',
            })
            // 获取用户数据，并将其存放在会话存储中
            const userData = JSON.stringify(result.data.data[0])
            sessionStorage.setItem('userData', userData)
            // 获取用户可访问的路由表，并将器存放在仓库中
            const route = result.data.route
            _this.$store.commit('login/SETROUTELISTS', route)
            // 登陆成功，跳转到主页
            _this.$router.push('/home')
          } else {
            _this.$message({
              showClose: true,
              message: '请检查输入的用户名和密码是否正确',
              type: 'warning'
            })
            _this.loginForm.name = ''
            _this.loginForm.password = ''
          }
        } catch (error) {
          console.log("错误" + error);
        }
      });
    },
  },
};
</script>

<style lang="scss">
body,
html {
  width: 100%;
  height: 100%;
}

.login {
  width: 100%;
  height: 100%;
  background: url(~@/assets/images/schoolGate.png) center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;

  h1 {
    text-align: center;
    color: #fff;
    margin-top: 50px;
    font-size: 42px;
  }

  .loginBox {
    position: absolute;
    width: 500px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -150px;

    .loginLogo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      margin: 0 auto;
      position: absolute;
      top: 0%;
      left: 50%;
      margin-left: -65px;
      margin-top: -65px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .login_form {
      position: absolute;
      width: 80%;
      bottom: 10px;
      margin-left: 10%;

      .form_item {
        input {
          height: 40px;
        }
      }

      .el-form-item__content {
        justify-content: flex-end;
        button {
          width: 75px;
          height: 40px;
        }
      }
    }
  }
}
</style>