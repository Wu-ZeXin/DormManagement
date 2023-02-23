<template>
  <el-card class="card-spacing">
    <el-select
      v-model="usermark"
      placeholder="请选择职工"
      size="default"
      clearable
      @visible-change="getEmployeeOptions"
      @change="getEmployeeData"
    >
      <el-input
        v-model="selectKey"
        style="width: 80%; margin: 0 10%"
        @change="getEmployeeOptions"
      ></el-input>
      <el-option
        v-for="item in selectOption"
        :key="item.usermark"
        :label="item.usermark"
        :value="item.usermark"
      >
        <span style="float: left">{{ item.usermark }}</span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{
          item.name
        }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="role"
      placeholder="请选择角色"
      size="default"
      clearable
      @visible-change="getRoleOptions"
      @change="getEmployeeData"
      style="margin-left: 20px"
    >
      <el-option
        v-for="item in roleSelectOptions"
        :key="item.role_id"
        :label="item.role_name"
        :value="item.role_id"
      >
      </el-option>
    </el-select>
    <el-button
      v-if="userStore.getOperationAuthority.includes('AddEmployeeInfo')"
      :color="themeColor"
      style="margin-left: 20px"
      @click="isAddEmployeeForm = true"
      >添加职工</el-button
    >
  </el-card>
  <el-card>
    <BasicTable :table-option="createEmployeeTable">
      <template #SexTag="scope">
        <el-tag v-if="scope.currentCellData.row.sex === '男'">男</el-tag>
        <el-tag v-else type="success">女</el-tag>
      </template>
    </BasicTable>
    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="page"
      :page-sizes="[7, 14, 21]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :background="true"
    />
  </el-card>
  <el-dialog v-model="isEditEmployeeForm" title="编辑职工信息" width="25%">
    <BasicForm :form-option="createEditEmployeeForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddEmployeeForm" title="添加职工信息" width="25%">
    <BasicForm :form-option="createAddEmployeeForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { type Ref, ref, computed, onBeforeMount, watch } from "vue";
  import { getOption } from "@/api/common";
  import { getEmployeeDataList, deleteEmployee, updateEmployee, addEmployee } from "@/api/userInfo";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { ElMessageBox } from "element-plus";
  import { Delete, Edit } from "@element-plus/icons-vue";
  import { checkTelephone, checkEmail } from "@/utils/validator";
  import { themeColor } from "$styleVariable";

  interface SelectOptionType {
    usermark: string;
    name: string;
  }

  interface RoleOptionType {
    role_id: number;
    role_name: string;
  }

  interface EmployeeDataType {
    usermark: string;
    name: string;
    sex: string;
    telephone: string;
    email: string;
    role: string;
  }

  const getEmployeeData = async () => {
    loading.value = true;
    let params = {
      usermark: usermark.value,
      role: role.value,
      page: page.value,
      pageSize: pageSize.value,
    };
    let result = await getEmployeeDataList(params);
    employeeData.value = result.employeeData;
    total.value = result.total;
    loading.value = false;
  };

  onBeforeMount(() => {
    getEmployeeData();
  });

  // 分页器总条数
  const total = ref(0);
  // 每页条数
  let pageSize = ref(7);
  // 当前页
  let page = ref(1);
  const loading = ref(true);
  const userStore = useUserStoreWithOut();

  const usermark = ref("");
  const role = ref("");
  const selectOption: Ref<Array<SelectOptionType>> = ref([]);
  const selectKey = ref("");
  const getEmployeeOptions = async (val: boolean) => {
    if (val || selectKey.value !== "") {
      let result = await getOption({ key: "employee", selectKey: selectKey.value });
      selectOption.value = result.selectOptions;
      if (usermark.value !== "") {
        selectKey.value = "";
      }
    }
  };
  const getRoleOptions = async (val: boolean) => {
    if (val && roleSelectOptions.value.length === 0) {
      let result = await getOption({ key: "role" });
      roleSelectOptions.value = result.selectOptions;
    }
  };

  const employeeData: Ref<Array<EmployeeDataType>> = ref([]);
  const employeeDataArr = [
    {
      prop: "usermark",
      title: "职工号",
    },
    {
      prop: "name",
      title: "姓名",
    },
    {
      prop: "sex",
      title: "性别",
    },
    {
      prop: "telephone",
      title: "电话",
    },
    {
      prop: "email",
      title: "邮箱",
    },
    {
      prop: "role_name",
      title: "系统角色",
    },
    {
      title: "操作",
    },
  ];

  const editEmployeeForm = ref({});
  const editEmployeeFormRef = ref();
  const isEditEmployeeForm = ref(false);
  const addEmployeeForm = ref({
    name: "",
    sex: "",
    telephone: "",
    email: "",
    role: "",
  });
  const addEmployeeFormRef = ref();
  const isAddEmployeeForm = ref(false);
  const roleSelectOptions: Ref<Array<RoleOptionType>> = ref([]);

  watch(
    page,
    () => {
      getEmployeeData();
    },
    {
      deep: true,
    },
  );

  watch(
    pageSize,
    () => {
      getEmployeeData();
    },
    {
      deep: true,
    },
  );
  // 员工信息表格配置对象
  const createEmployeeTable = computed(() => {
    return {
      data: employeeData,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: employeeDataArr
        .map((item: any) => {
          if (item.title !== "操作") {
            if (item.prop !== "sex") {
              return {
                attr: {
                  prop: item.prop,
                  label: item.title,
                  headerAlign: "center",
                  align: "center",
                  width: item.prop === "email" ? "250px" : "",
                },
              };
            } else {
              return {
                attr: {
                  prop: item.prop,
                  label: item.title,
                  headerAlign: "center",
                  align: "center",
                  width: "80px",
                },
                defaultSlotName: "SexTag",
              };
            }
          } else {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
                width: "160px",
              },
              defaultSlotConfig: ["Edit", "Delete"]
                .map((child: string) => {
                  return {
                    comp: "el-button",
                    attr: {
                      icon: child === "Edit" ? Edit : Delete,
                      type: child === "Edit" ? "warning" : "danger",
                      link: true,
                    },
                    content: {
                      text: child === "Edit" ? "编辑" : "删除",
                    },
                    event: {
                      click: (currentRowData: any) => {
                        if (child === "Edit") {
                          editEmployeeForm.value = JSON.parse(JSON.stringify(currentRowData.row));
                          isEditEmployeeForm.value = true;
                        } else {
                          ElMessageBox.confirm("确定删除职工信息吗？", "提示", {
                            type: "error",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            callback: async (action: string) => {
                              if (action === "confirm") {
                                await deleteEmployee({ usermark: currentRowData.row.usermark });
                                getEmployeeData();
                              }
                            },
                          });
                        }
                      },
                    },
                  };
                })
                .filter((item: any) => {
                  if (item.content.text === "编辑") {
                    return userStore.getOperationAuthority.includes("EditEmployeeInfo");
                  } else {
                    return userStore.getOperationAuthority.includes("DeleteEmployeeInfo");
                  }
                }),
            };
          }
        })
        .filter((item: any) => {
          if (item.attr.label !== "操作") {
            return true;
          } else {
            return (
              userStore.getOperationAuthority.includes("EditEmployeeInfo") ||
              userStore.getOperationAuthority.includes("DeleteEmployeeInfo")
            );
          }
        }),
    };
  });

  const title = {
    usermark: {
      label: "职工号",
      placeholder: "请输入职工号",
    },
    name: {
      label: "姓名",
      placeholder: "请输入姓名",
    },
    telephone: {
      label: "电话",
      placeholder: "请输入电话",
    },
    email: {
      label: "邮箱",
      placeholder: "请输入邮箱",
    },
  };
  const renderItemArr = (obj: any) => {
    return Object.keys(obj).map((key: string) => {
      if (key === "sex") {
        return [
          {
            attr: {
              prop: key,
              label: "性别",
            },
            component: {
              comp: "el-select",
              attr: {
                size: "default",
                placeholder: "请选择性别",
                clearable: true,
                style: {
                  width: "100%",
                },
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
        ];
      } else if (key === "role_name" || key === "role") {
        return [
          {
            attr: {
              prop: key,
              label: "系统角色",
            },
            component: {
              comp: "el-select",
              attr: {
                size: "default",
                placeholder: "请选择系统角色",
                clearable: true,
                style: {
                  width: "100%",
                },
              },
              event: {
                visibleChange: async (val: boolean) => {
                  if (val) {
                    let result = await getOption({ key: "role" });
                    roleSelectOptions.value = result.selectOptions;
                  }
                },
              },
              children: roleSelectOptions.value.map((option: any) => {
                return {
                  comp: "el-option",
                  attr: {
                    label: option.role_name,
                    value: option.role_id,
                  },
                };
              }),
            },
          },
        ];
      } else {
        return [
          {
            attr: {
              prop: key,
              label: title[key]["label"],
            },
            component: {
              comp: "el-input",
              attr: {
                size: "default",
                disabled: key === "usermark",
                placeholder: title[key]["placeholder"],
              },
            },
          },
        ];
      }
    });
  };
  // 编辑员工信息表单配置对象
  const createEditEmployeeForm = computed(() => {
    return {
      mode: editEmployeeForm,
      ref: editEmployeeFormRef,
      attr: {
        size: "default",
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { validator: checkEmail, message: "邮箱格式错误！", trigger: "blur" },
          ],
          telephone: [
            { required: true, message: "请输入电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(editEmployeeForm.value),
        [
          {
            component: {
              comp: "div",
              attr: {
                style: {
                  marginLeft: "auto",
                },
              },
              children: ["确定", "取消"].map((key: string) => {
                return {
                  comp: "el-button",
                  attr: {
                    size: "default",
                    color: key === "确定" ? themeColor : "",
                  },
                  event: {
                    click: () => {
                      if (key === "取消") {
                        isEditEmployeeForm.value = false;
                      } else {
                        editEmployeeFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await updateEmployee(editEmployeeForm.value);
                          getEmployeeData();
                          isEditEmployeeForm.value = false;
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
  // 添加员工表单配置对象
  const createAddEmployeeForm = computed(() => {
    return {
      mode: addEmployeeForm,
      ref: addEmployeeFormRef,
      attr: {
        size: "default",
        rules: {
          name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { validator: checkEmail, message: "邮箱格式错误！", trigger: "blur" },
          ],
          telephone: [
            { required: true, message: "请输入电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addEmployeeForm.value),
        [
          {
            component: {
              comp: "div",
              attr: {
                style: {
                  marginLeft: "auto",
                },
              },
              children: ["确定", "取消"].map((key: string) => {
                return {
                  comp: "el-button",
                  attr: {
                    size: "default",
                    color: key === "确定" ? themeColor : "",
                  },
                  event: {
                    click: () => {
                      if (key === "取消") {
                        isAddEmployeeForm.value = false;
                      } else {
                        addEmployeeFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addEmployee(addEmployeeForm.value);
                          getEmployeeData();
                          isAddEmployeeForm.value = false;
                          addEmployeeFormRef.value.resetFields();
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
  .el-pagination {
    margin: 15px 0 0;
    justify-content: center;
  }
</style>
