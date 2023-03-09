<template>
  <div>
    <div class="role-list">
      <h1>角色列表</h1>
      <el-button v-if="userStore.getOperationAuthority.includes('AddRole')" :color="themeColor" @click="isAddRoleForm = true">添加角色</el-button>
    </div>
    <BasicTable :table-option="createRoleTable"></BasicTable>
  </div>
  <el-dialog v-model="isEditRoleForm" title="编辑角色" width="25%">
    <BasicForm :form-option="createEditRoleForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddRoleForm" title="添加角色" width="25%">
    <BasicForm :form-option="createAddRoleForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeMount } from "vue";
  import { getRole, addRole, updateRole, deleteRole } from "@/api/role";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { themeColor } from "$styleVariable";
  import { ElMessageBox } from "element-plus";
  import { Delete, Edit } from "@element-plus/icons-vue";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  const getRoleList = async () => {
    loading.value = true;
    let result = await getRole();
    roleList.value = result.roleList;
    loading.value = false;
  };

  onBeforeMount(() => {
    getRoleList();
  });

  const roleList = ref([]);
  const loading = ref(true);
  const userStore = useUserStoreWithOut();
  const editRoleForm = ref({});
  const editRoleFormRef = ref();
  const isEditRoleForm = ref(false);
  const addRoleForm = ref({
    role_name: "",
  });
  const addRoleFormRef = ref();
  const isAddRoleForm = ref(false);

  const roleTableData = [
    {
      prop: "role_id",
      title: "角色ID",
    },
    {
      prop: "role_name",
      title: "角色名称",
    },
    {
      title: "操作",
    },
  ];
  const roleTableOperation = [
    {
      text: "编辑",
      type: "warning",
      icon: Edit,
    },
    {
      text: "删除",
      type: "danger",
      icon: Delete,
    },
  ];
  const createRoleTable = computed(() => {
    return {
      data: roleList,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
        rowKey: "role_id",
      },
      columnArr: roleTableData
        .map((item: any) => {
          if (item.title !== "操作") {
            return {
              attr: {
                prop: item.prop,
                label: item.title,
                headerAlign: "center",
                align: "center",
              },
            };
          } else {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
              },
              defaultSlotConfig: roleTableOperation
                .map((child: any) => {
                  return {
                    comp: "el-button",
                    attr: {
                      icon: child["icon"],
                      type: child["type"],
                      link: true,
                    },
                    content: {
                      text: child["text"],
                    },
                    event: {
                      click: (currentRowData: any) => {
                        if (child["text"] === "编辑") {
                          editRoleForm.value = currentRowData.row;
                          isEditRoleForm.value = true;
                        } else {
                          ElMessageBox.confirm("确定删除权限吗？", "提示", {
                            type: "error",
                            buttonSize: "default",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            callback: async (action: string) => {
                              if (action === "confirm") {
                                await deleteRole({
                                  role_id: currentRowData.row.role_id,
                                });
                                getRoleList();
                              }
                            },
                          });
                        }
                      },
                    },
                  };
                })
                .filter((item) => {
                  if (item.content.text === "编辑") {
                    return userStore.getOperationAuthority.includes("EditRole");
                  } else {
                    return userStore.getOperationAuthority.includes("DeleteRole");

                  }
                }),
            };
          }
        })
        .filter((item) => {
          if (item.attr.label !== "操作") {
            return true;
          } else {
            return (
              userStore.getOperationAuthority.includes("EditRole") ||
              userStore.getOperationAuthority.includes("DeleteRole")
            );
          }
        }),
    };
  });
  const roleFormData = {
    role_id: {
      label: "角色ID",
      placeholder: "请输入角色ID",
    },
    role_name: {
      label: "角色名称",
      placeholder: "请输入角色名称",
    },
  };
  const renderItemArr = (obj: any) => {
    return Object.keys(obj).map((key: string) => {
      return [
        {
          attr: {
            prop: key,
            label: roleFormData[key]["label"],
          },
          component: {
            comp: "el-input",
            attr: {
              size: "default",
              placeholder: roleFormData[key]["placeholder"],
              disabled: key === "role_id",
            },
          },
        },
      ];
    });
  };
  // 编辑角色表单配置对象
  const createEditRoleForm = computed(() => {
    return {
      mode: editRoleForm,
      ref: editRoleFormRef,
      attr: {
        size: "default",
        rules: {
          role_name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(editRoleForm.value),
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
                        isEditRoleForm.value = false;
                      } else {
                        editRoleFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await updateRole(editRoleForm.value);
                          getRoleList();
                          isEditRoleForm.value = false;
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
  // 添加角色配置对象
  const createAddRoleForm = computed(() => {
    return {
      mode: addRoleForm,
      ref: addRoleFormRef,
      attr: {
        size: "default",
        rules: {
          role_name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addRoleForm.value),
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
                        isAddRoleForm.value = false;
                      } else {
                        addRoleFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addRole(addRoleForm.value);
                          getRoleList();
                          isAddRoleForm.value = false;
                          addRoleFormRef.value.resetFields();
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
  .role-list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 25px;
      font-weight: 700;
      margin-right: 20px;
    }
  }
</style>
