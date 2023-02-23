<template>
  <LoginBackground :height="'350px'">
    <template #FormContent>
      <BasicForm :formOption="createForgetPasswordForm"></BasicForm>
    </template>
  </LoginBackground>
</template>

<script setup lang="ts">
  import LoginBackground from "@/layout/LoginBackground/index.vue";
  import GetAuthCode from "@/views/common/src/GetAuthCode.vue";
  import { BasicForm } from "@/components/Form";
  import { themeColor } from "$styleVariable";
  import { checkTelephone } from "@/utils/validator";
  import { type UnwrapRef, reactive, computed } from "vue";

  interface ForgetPasswordForm {
    password: string;
    confirmPassword: string;
    telephone: string;
    authCode: string;
  }

  const forgetPasswordForm: UnwrapRef<ForgetPasswordForm> = reactive({
    password: "",
    confirmPassword: "",
    telephone: "",
    authCode: "",
  });

  const createForgetPasswordForm = computed(() => {
    return {
      mode: forgetPasswordForm,
      attr: {
        rules: {
          password: [{ required: true, message: "密码不能为空！", trigger: "blur" }],
          confirmPassword: [{ required: true, message: "再次输入密码！", trigger: "blur" }],
          telephone: [
            { required: true, message: "手机号码不能为空！", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          authCode: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        },
      },
      itemArr: [
        [
          {
            attr: {
              prop: "password",
            },
            component: {
              comp: "el-input",
              attr: {
                type: "password",
                placeholder: "请输入密码",
                "show-password": true,
              },
            },
          },
        ],
        [
          {
            attr: {
              prop: "confirmPassword",
            },
            component: {
              comp: "el-input",
              attr: {
                type: "password",
                placeholder: "请再次输入密码",
                "show-password": true,
              },
            },
          },
        ],
        [
          {
            attr: {
              prop: "telephone",
            },
            component: {
              comp: "el-input",
              attr: {
                type: "text",
                placeholder: "请输入手机号码",
              },
            },
          },
        ],
        [
          {
            attr: {
              prop: "authCode",
            },
            component: {
              comp: GetAuthCode,
              attr: {
                authCodeForm: {
                  mode: forgetPasswordForm,
                  prop: "authCode",
                  btn: {
                    span: 8,
                    attr: {
                      style: {
                        width: "100%",
                        "font-size": "6px",
                        padding: "8px 4px",
                      },
                    },
                    html: `<span>${"获取验证码"}</span>`,
                  },
                  input: {
                    span: 16,
                    attr: {
                      placeholder: "请输入验证码",
                    },
                  },
                },
              },
            },
          },
        ],
        [
          {
            attr: {
              "label-width": "0",
            },
            component: {
              comp: "el-button",
              publicEvent: "submit",
              attr: {
                color: themeColor,
                style: {
                  width: "100%",
                },
              },
              content: {
                text: "确认",
              },
            },
          },
        ],
      ],
    };
  });
</script>

<style scoped lang="less"></style>
