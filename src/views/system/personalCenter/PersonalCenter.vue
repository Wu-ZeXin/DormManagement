<template>
  <el-card style="height: 100%">
    <div class="personal-form" v-show="isShow">
      <span class="title">个人信息</span>
      <BasicForm :form-option="createPersonalForm"></BasicForm>
      <div style="margin-top: 30px">
        <el-button :color="themeColor" class="self-button" @click="editUserInfo">{{
          isEdit ? "编辑信息" : "确认编辑"
        }}</el-button>
        <el-button :color="themeColor" class="self-button" @click="changePassword"
          >修改密码</el-button
        >
      </div>
      <div class="portrait">
        <el-avatar :src="portrait" :icon="portrait === null ? UserFilled : ''" :size="200" />
        <el-upload
          action="#"
          class="edit-portrait"
          :on-change="handleFile"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button :color="themeColor" size="small">修改头像</el-button>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onBeforeMount, unref, watch } from "vue";
  import { themeColor } from "$styleVariable";
  import { getUserInfo, updateUserInfo, modifyPortrait } from "@/api/user";
  import { convertBase64 } from "@/utils";
  import { checkTelephone, checkEmail } from "@/utils/validator";
  import { useUserStoreWithOut } from "$stores/user";
  import { BasicForm } from "@/components/Form";
  import { createDialog } from "@/components/Dialog";
  import { ElMessageBox } from "element-plus";
  import { UserFilled } from "@element-plus/icons-vue";

  const personalData = reactive({});
  const personalRef = ref();
  const renderData = ref([]);
  const portrait = ref();
  const isEdit = ref(true);
  const isShow = ref(false);
  const userStore = useUserStoreWithOut();

  onBeforeMount(async () => {
    portrait.value = userStore.getPortrait;
    let result = await getUserInfo();
    result.userInfo.forEach((item: any) => {
      personalData[item.filed_key] = item.filed_value;
    });
    renderData.value = result.userInfo;
    isShow.value = true;
  });

  watch(
    () => userStore.portrait,
    () => {
      portrait.value = userStore.getPortrait;
    },
    { deep: true },
  );

  const handleFile = (file: any) => {
    convertBase64(file.raw).then(async (res) => {
      await modifyPortrait({ portrait: res });
      userStore.setPortrait(res);
    });
  };

  const editUserInfo = async () => {
    if (!isEdit.value) {
      await updateUserInfo(unref(personalData));
    }
    isEdit.value = !isEdit.value;
  };

  const changePasswordForm = ref({
    password: "",
    confirmPassword: "",
  });
  const changePasswordRef = ref();
  const changePasswordFormDialog = ref(false);
  const checkPasswordIsSame = (rule: any, value: any, cb: any) => {
    if (value === "") {
      cb(new Error("请再次输入密码"));
    } else if (value !== changePasswordForm.value.password) {
      cb(new Error("两次输入的密码不一致！"));
    } else {
      cb();
    }
  };
  const changePassword = () => {
    createDialog({
      id: "changePassword",
      dialogVisible: changePasswordFormDialog,
      attr: {
        title: "修改密码",
        width: "20%",
        top: "35vh",
      },
      content: [
        {
          type: "Form",
          mode: changePasswordForm,
          ref: changePasswordRef,
          attr: {
            rules: {
              password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
              confirmPassword: [
                { required: true, validator: checkPasswordIsSame, trigger: "blur" },
              ],
            },
            labelWidth: "80px",
          },
          itemArr: [
            ["新密码", "password"],
            ["确认密码", "confirmPassword"],
          ].map((item: Array<T>) => {
            return [
              {
                attr: {
                  prop: item[1],
                  label: item[0],
                  style: {
                    marginBottom: item[1] === "password" ? "18px" : "0px",
                  },
                },
                component: {
                  comp: "el-input",
                  attr: {
                    type: "password",
                    showPassword: true,
                  },
                },
              },
            ];
          }),
        },
      ],
      footer: {
        comp: "div",
        children: ["确认", "取消"].map((item: string) => {
          return {
            comp: "el-button",
            attr: {
              color: themeColor,
            },
            event: {
              click: () => {
                if (item === "取消") {
                  changePasswordFormDialog.value = false;
                } else {
                  changePasswordRef.value.validate(async (valid: boolean) => {
                    if (!valid) return;
                    ElMessageBox.confirm("确定修改密码吗？", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning",
                      callback: async (action: string) => {
                        if (action === "confirm") {
                          await userStore.reqModifyPassword(changePasswordForm.value);
                          changePasswordRef.value.resetFields();
                          changePasswordFormDialog.value = false;
                        }
                      },
                    });
                  });
                }
              },
            },
            content: {
              text: item,
            },
          };
        }),
      },
    });
    changePasswordFormDialog.value = true;
  };

  const renderItemArr = () => {
    const itemArr = [] as Array<T>;
    const editable = [
      "name",
      "sex",
      "telephone",
      "email",
      "father",
      "father_telephone",
      "mother",
      "mother_telephone",
    ];
    const singleLine = ["usermark", "name", "sex", "telephone", "email"];
    renderData.value.forEach((item: any) => {
      if (singleLine.includes(item.filed_key)) {
        if (item.filed_key !== "sex") {
          itemArr.push([
            {
              span: 12,
              attr: {
                prop: item.filed_key,
                label: item.filed_name,
              },
              component: {
                comp: "el-input",
                attr: {
                  size: "default",
                  disabled: !editable.includes(item.filed_key) || isEdit.value,
                },
              },
            },
          ]);
        } else {
          itemArr.push([
            {
              span: 12,
              attr: {
                prop: item.filed_key,
                label: item.filed_name,
              },
              component: {
                comp: "el-select",
                attr: {
                  disabled: !editable.includes(item.filed_key) || isEdit.value,
                  size: "default",
                },
                children: ["男", "女"].map((option: string) => {
                  return {
                    comp: "el-option",
                    attr: {
                      label: option,
                      value: option,
                    },
                  };
                }),
              },
            },
          ]);
        }
      } else {
        if (
          !singleLine.includes(itemArr[itemArr.length - 1][0].attr.prop) &&
          itemArr[itemArr.length - 1].length !== 2
        ) {
          itemArr[itemArr.length - 1].push({
            span: 12,
            attr: {
              prop: item.filed_key,
              label: item.filed_name,
            },
            component: {
              comp: "el-input",
              attr: {
                disabled: !editable.includes(item.filed_key) || isEdit.value,
              },
            },
          });
        } else {
          itemArr.push([
            {
              span: 12,
              attr: {
                prop: item.filed_key,
                label: item.filed_name,
              },
              component: {
                comp: "el-input",
                attr: {
                  disabled: !editable.includes(item.filed_key) || isEdit.value,
                },
              },
            },
          ]);
        }
      }
    });
    return itemArr;
  };

  const createPersonalForm = computed(() => {
    return {
      mode: personalData,
      ref: personalRef,
      attr: {
        labelWidth: "100px",
        hideRequiredAsterisk: true,
        style: {
          width: "60%",
        },
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { validator: checkEmail, message: "邮箱格式错误！", trigger: "blur" },
          ],
          telephone: [
            { required: true, message: "请输入电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          father: [{ required: true, message: "请输入父亲姓名", trigger: "blur" }],
          father_telephone: [
            { required: true, message: "请输入父亲电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          mother: [{ required: true, message: "请输入母亲姓名", trigger: "blur" }],
          mother_telephone: [
            { required: true, message: "请输入母亲电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
        },
      },
      itemArr: renderItemArr(),
    };
  });
</script>

<style scoped lang="less">
  .personal-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-top: 30px;

    .title {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .portrait {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 70px;
      left: 61%;

      .edit-portrait {
        margin-top: 5px;
      }
    }

    .self-button {
      width: 200px;
    }
  }

  :deep(.el-select) {
    width: 100%;
  }

  .button-style {
    background-color: @themeColor;
  }
</style>
