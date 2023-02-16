<template>
  <div class="login">
    <h1>宿舍管理系统</h1>
    <div class="loginBox">
      <!-- logo区域 -->
      <div class="loginLogo">
        <img src="@/assets/images/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <div class="login_form">
        <slot name="FormContent"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const props = defineProps({
    height: { type: String, default: "300px" },
  });

  const loginBoxHeight = ref(props.height);
</script>

<style scoped lang="less">
  .login {
    width: 100%;
    min-height: 100vh;
    background: url(@/assets/images/HZU.jpg) center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;

    h1 {
      position: absolute;
      text-align: center;
      color: #007d8c;
      top: 15%;
      left: 42%;
      font-size: 50px;
      font-weight: 700;
    }

    .loginBox {
      position: absolute;
      width: 500px;
      height: v-bind("loginBoxHeight");
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      top: 52%;
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
      }
    }
  }
</style>
