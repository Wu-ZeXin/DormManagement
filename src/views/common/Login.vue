<template>
  <LoginBackground>
    <template #FormContent>
      <el-select
        v-model="loginForm.userRole"
        placeholder="请选择用户角色"
        size="small"
        class="user-role"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          size="small"
        />
      </el-select>
      <BasicForm :form-option="createLoginForm"></BasicForm>
    </template>
  </LoginBackground>
</template>

<script setup lang="ts">
  import LoginBackground from "@/layout/LoginBackground/index.vue";
  import { BasicForm } from "@/components/Form";
  import { useRouter } from "vue-router";
  import { useUserStoreWithOut } from "$stores/user";
  import { ElMessage } from "element-plus";
  import { type UnwrapRef, reactive, computed, ref, toRaw } from "vue";
  import { s } from "$locales";
  import { themeColor } from "$styleVariable";

  interface LoginForm {
    userMark: string;
    password: string;
    userRole: string;
  }

  const router = useRouter();
  const userStore = useUserStoreWithOut();
  const loginForm: UnwrapRef<LoginForm> = reactive({
    userMark: "",
    password: "",
    userRole: "",
  });
  const loginRef = ref();

  const options = reactive([
    {
      value: "employee",
      label: "职工",
    },
    {
      value: "student",
      label: "学生",
    },
  ]);

  const login = async () => {
    if (loginForm.userRole !== "") {
      try {
        await userStore.Login(toRaw(loginForm));
        router.push({
          name: "Welcome",
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      ElMessage({
        message: "未选择用户角色！",
        type: "error",
      });
    }
  };

  const createLoginForm = computed(() => {
    return {
      mode: loginForm,
      ref: loginRef,
      attr: {
        rules: {
          userMark: [{ required: true, message: s("请输入学号或职工号"), trigger: "blur" }],
          password: [{ required: true, message: s("请输入密码"), trigger: "blur" }],
        },
      },
      itemArr: [
        [
          {
            attr: {
              prop: "userMark",
            },
            component: {
              comp: "el-input",
              attr: {
                type: "text",
                placeholder: s("请输入学号或职工号"),
              },
              event: {
                keyup: ($event: any) => {
                  if ($event.keyCode === 13) {
                    loginRef.value.validate((valid: boolean) => {
                      if (!valid) return;
                      login();
                    });
                  }
                },
              },
            },
          },
        ],
        [
          {
            attr: {
              prop: "password",
            },
            component: {
              comp: "el-input",
              attr: {
                type: "password",
                placeholder: s("请输入密码"),
                "show-password": true,
              },
              event: {
                keyup: ($event: any) => {
                  if ($event.keyCode === 13) {
                    loginRef.value.validate((valid: boolean) => {
                      if (!valid) return;
                      login();
                    });
                  }
                },
              },
            },
          },
        ],
        [
          {
            attr: {
              style: {
                "margin-bottom": "0px",
              },
            },
            component: {
              comp: "el-button",
              attr: {
                style: {
                  width: "100%",
                },
                color: themeColor,
              },
              event: {
                submit: login,
              },
              content: {
                text: s("登录"),
              },
            },
          },
        ],
        [
          {
            component: {
              comp: "a",
              attr: {
                class: "forget-password",
              },
              event: {
                click: () => {
                  router.push({
                    name: "ForgetPassword",
                  });
                },
              },
              content: {
                text: s("忘记密码？"),
              },
            },
          },
        ],
      ],
    };
  });
</script>

<style scoped lang="less">
  :deep(.forget-password) {
    text-decoration: underline #001ba0;
    color: #001ba0;
    cursor: pointer;
    margin-left: auto;
  }

  .user-role {
    position: absolute;
    right: 0px;
    top: -85px;
    width: 120px;
  }
</style>
