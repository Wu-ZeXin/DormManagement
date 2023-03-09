<template>
  <el-card class="logistics-background">
    <div class="container">
      <div>
        <BasicForm :form-option="createRepairBillsForm"></BasicForm>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from "vue";
  import { BasicForm } from "@/components/Form";
  import { themeColor } from "$styleVariable";
  import { ElMessage } from "element-plus";
  import { getOption } from "@/api/common";
  import { addRepairBill } from "@/api/repair";
  import { checkTelephone } from "@/utils/validator";

  const addRepairBillsForm = ref({
    first_repair_type: "",
    secondary_repair_type: "",
    contact_person: "",
    contact_telephone: "",
    usermark: "",
    repair_dorm_build: "",
    repair_dorm: "",
    repair_description: "",
  });
  const addRepairBillsFormRef = ref();
  const addRepairBillsFormData = {
    first_repair_type: {
      label: "一级报修类型",
      placeholder: "请选择一级报修类型",
    },
    secondary_repair_type: {
      label: "二级报修类型",
      placeholder: "请选择二级报修类型",
    },
    contact_person: {
      label: "联系人",
      placeholder: "请输入联系人",
    },
    usermark: {
      label: "学号",
      placeholder: "请输入学号",
    },
    contact_telephone: {
      label: "联系电话",
      placeholder: "请输入联系电话",
    },
    repair_dorm_build: {
      label: "报修楼栋",
      placeholder: "请选择报修楼栋",
    },
    repair_dorm: {
      label: "报修宿舍",
      placeholder: "请选择报修宿舍",
    },
    repair_description: {
      label: "报修详细描述",
      placeholder: "请输入报修详细描述",
    },
  };
  const selectLabel = {
    first_repair_type: "repair_name",
    secondary_repair_type: "repair_name",
    repair_dorm_build: "dorm_build_name",
    repair_dorm: "dorm_number",
  };
  const selectOptions = reactive({
    first_repair_type: [],
    secondary_repair_type: [],
    repair_dorm_build: [],
    repair_dorm: [],
  });
  const currentSelect = reactive({
    first_repair_type: "",
    repair_dorm_build: "",
  });

  // 表单项配置对象
  const renderItemArr = (obj: any) => {
    let select = ["first_repair_type", "secondary_repair_type", "repair_dorm_build", "repair_dorm"];
    let itemArr: Array<T> = [[]];
    Object.keys(obj).forEach((key: string) => {
      if (key === "repair_description") {
        itemArr[0].push({
          span: 24,
          attr: {
            prop: key,
            label: addRepairBillsFormData[key].label,
          },
          component: {
            comp: "el-input",
            attr: {
              type: "textarea",
              rows: 10,
              placeholder: addRepairBillsFormData[key].placeholder,
            },
          },
        });
      } else if (select.includes(key)) {
        itemArr[0].push({
          span: 12,
          attr: {
            prop: key,
            label: addRepairBillsFormData[key].label,
          },
          component: {
            comp: "el-select",
            attr: {
              placeholder: addRepairBillsFormData[key].placeholder,
              clearable: true,
              style: {
                width: "100%",
              },
            },
            event: {
              visibleChange: async (val: boolean) => {
                if (val) {
                  let selectKey: any;
                  if (key === "first_repair_type" || key === "repair_dorm_build") {
                    if (selectOptions[key].length > 0) return;
                  } else if (key === "secondary_repair_type") {
                    if (
                      currentSelect.first_repair_type ===
                        addRepairBillsForm.value.first_repair_type &&
                      currentSelect.first_repair_type !== ""
                    )
                      return;
                    selectOptions.secondary_repair_type = [];
                    if (addRepairBillsForm.value.first_repair_type === "") {
                      ElMessage.warning("请先选择一级报修类型");
                      return;
                    }
                    selectKey = addRepairBillsForm.value.first_repair_type;
                    currentSelect.first_repair_type = addRepairBillsForm.value.first_repair_type;
                  } else {
                    if (
                      currentSelect.repair_dorm_build ===
                        addRepairBillsForm.value.repair_dorm_build &&
                      currentSelect.repair_dorm_build !== ""
                    )
                      return;
                    selectOptions.repair_dorm = [];
                    if (addRepairBillsForm.value.repair_dorm_build === "") {
                      ElMessage.warning("请先选择报修楼栋");
                      return;
                    }
                    selectKey = addRepairBillsForm.value.repair_dorm_build;
                    currentSelect.repair_dorm_build = addRepairBillsForm.value.repair_dorm_build;
                  }
                  let result = await getOption({ key, selectKey });
                  selectOptions[key] = result.selectOptions;
                }
              },
              change: () => {
                if (key === "first_repair_type") {
                  addRepairBillsForm.value.secondary_repair_type = "";
                }
              },
            },
            children: selectOptions[key].map((option: any) => {
              return {
                comp: "el-option",
                attr: {
                  label: option[selectLabel[key]],
                  value: option[selectLabel[key]],
                },
              };
            }),
          },
        });
      } else {
        itemArr[0].push({
          span: 8,
          attr: {
            prop: key,
            label: addRepairBillsFormData[key]["label"],
            labelWidth: key === "contact_person" ? "110px" : "75px",
          },
          component: {
            comp: "el-input",
            attr: {
              placeholder: addRepairBillsFormData[key]["placeholder"],
            },
          },
        });
      }
    });
    return itemArr;
  };
  // 编辑表单配置对象
  const createRepairBillsForm = computed(() => {
    return {
      mode: addRepairBillsForm,
      ref: addRepairBillsFormRef,
      attr: {
        size: "large",
        rules: {
          first_repair_type: [{ required: true, message: "请选择一级报修类型", trigger: "blur" }],
          secondary_repair_type: [
            { required: true, message: "请选择二级报修类型", trigger: "blur" },
          ],
          contact_person: [{ required: true, message: "请输入联系人", trigger: "blur" }],
          contact_telephone: [
            { required: true, message: "请输入联系电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机号码格式错误！", trigger: "blur" },
          ],
          usermark: [{ required: true, message: "请输入学号", trigger: "blur" }],
          repair_dorm_build: [{ required: true, message: "请选择报修楼栋", trigger: "blur" }],
          repair_dorm: [{ required: true, message: "请选择报修宿舍", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "110px",
        labelPosition: "right",
      },
      itemArr: [
        ...renderItemArr(addRepairBillsForm.value),
        [
          {
            component: {
              comp: "div",
              attr: {
                style: {
                  margin: "0 auto",
                },
              },
              children: ["提交", "重置"].map((key: string) => {
                return {
                  comp: "el-button",
                  attr: {
                    size: "large",
                    color: key === "提交" ? themeColor : "",
                  },
                  event: {
                    click: () => {
                      if (key === "重置") {
                        addRepairBillsFormRef.value.resetFields();
                      } else {
                        addRepairBillsFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addRepairBill(addRepairBillsForm.value);
                          addRepairBillsFormRef.value.resetFields();
                        });
                      }
                    },
                  },
                  content: {
                    text: key,
                  },
                };
              }),
            },
          },
        ],
      ],
    };
  });
</script>

<style scoped lang="less">
  .logistics-background {
    height: 100%;
    background-image: url("@/assets/images/logistics.jpg");
    background-size: 100% 100%;

    .container {
      width: 60%;
      height: 100%;
      padding: 0 30px 0 0;
      display: flex;
      align-items: center;
    }
  }

  :deep(.el-card__body) {
    height: 100%;
  }

  :deep(.el-form-item__label) {
    color: #fff;
  }
</style>
