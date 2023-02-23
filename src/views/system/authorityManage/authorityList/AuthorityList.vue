<template>
  <el-card>
    <div class="authority-list-header">
      <h1>系统权限列表</h1>
      <el-button
        v-if="userStore.getOperationAuthority.includes('AddAuthority')"
        class="card-spacing"
        :color="themeColor"
        @click="isAddAuthorityForm = true"
        >添加权限模块</el-button
      >
    </div>
    <BasicTable :table-option="authorityTable">
      <template #AuthorityType="scope">
        <el-tag v-if="scope.currentCellData.row.authority_type === 0" type="success"
          >路由权限</el-tag
        >
        <el-tag v-else type="danger">操作权限</el-tag>
      </template></BasicTable
    >
  </el-card>
  <el-dialog v-model="isEditAuthorityForm" title="编辑权限" width="25%">
    <BasicForm :form-option="createEditAuthorityForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddAuthorityForm" title="添加权限" width="25%">
    <BasicForm :form-option="createAddAuthorityForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { ref, computed, onBeforeMount } from "vue";
  import {
    getAuthorityList,
    deleteAuthority,
    addAuthority,
    updateAuthority,
  } from "@/api/authority";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { Delete, Edit, Plus } from "@element-plus/icons-vue";
  import { themeColor } from "$styleVariable";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  const authorityList = ref([]);
  const authority_pid = ref(0);
  const loading = ref(false);
  const userStore = useUserStoreWithOut();

  const reqAuthorityList = async () => {
    loading.value = true;
    let result = await getAuthorityList();
    authorityList.value = result.authority;
    loading.value = false;
  };

  onBeforeMount(() => {
    reqAuthorityList();
  });

  const editAuthorityForm = ref({});
  const editAuthorityFormRef = ref();
  const isEditAuthorityForm = ref(false);
  const addAuthorityForm = ref({
    authority_id: "",
    authority_title: "",
    authority_name: "",
    authority_path: "",
    authority_type: "",
  });
  const addAuthorityFormRef = ref();
  const isAddAuthorityForm = ref(false);

  const authorityTableData = [
    {
      prop: "authority_id",
      title: "权限ID",
    },
    {
      prop: "authority_title",
      title: "权限标题",
    },
    {
      prop: "authority_name",
      title: "权限名",
    },
    {
      prop: "authority_type",
      title: "权限类型",
    },
    {
      title: "操作",
    },
  ];
  const authorityTableOperation = [
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
    {
      text: "添加子权限",
      type: "success",
      icon: Plus,
    },
  ];
  const authorityFormData = {
    authority_id: {
      label: "权限ID",
      placeholder: "请输入权限ID",
    },
    authority_pid: {
      label: "父权限ID",
      placeholder: "请输入父权限ID",
    },
    authority_title: {
      label: "权限标题",
      placeholder: "请输入权限标题",
    },
    authority_name: {
      label: "权限名",
      placeholder: "请输入权限名",
    },
    authority_path: {
      label: "权限路由",
      placeholder: "请输入权限路由",
    },
    authority_type: {
      label: "权限类型",
      placeholder: "请输入权限类型",
    },
  };
  const renderItemArr = (obj: any) => {
    let disabledArr = ["authority_id", "authority_pid"];
    return Object.keys(obj).map((key: string) => {
      if (key === "authority_type") {
        return [
          {
            attr: {
              prop: key,
              label: authorityFormData[key].label,
            },
            component: {
              comp: "el-select",
              attr: {
                size: "default",
                placeholder: authorityFormData[key].placeholder,
                clearable: true,
                style: {
                  width: "100%",
                },
                disabled: Object.keys(obj).includes("authority_pid"),
              },
              children: [
                [0, "路由权限"],
                [1, "操作权限"],
              ].map((option: Array<T>) => {
                return {
                  comp: "el-option",
                  attr: {
                    label: option[1],
                    value: option[0],
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
              label: authorityFormData[key]["label"],
            },
            component: {
              comp: "el-input",
              attr: {
                size: "default",
                placeholder: authorityFormData[key]["placeholder"],
                disabled: Object.keys(obj).includes("authority_pid") && disabledArr.includes(key),
              },
            },
          },
        ];
      }
    });
  };
  const authorityTable = computed(() => {
    return {
      data: authorityList,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
        rowKey: "authority_id",
      },
      columnArr: authorityTableData
        .map((item: any) => {
          if (item.title !== "操作") {
            return {
              attr: {
                prop: item.prop,
                label: item.title,
                headerAlign: "center",
                align: "center",
                width: item.prop === "authority_id" ? "160px" : "",
              },
              defaultSlotName: item.prop === "authority_type" ? "AuthorityType" : undefined,
            };
          } else {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
                width: "260px",
              },
              defaultSlotConfig: authorityTableOperation
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
                          const {
                            authority_id,
                            authority_pid,
                            authority_title,
                            authority_name,
                            authority_path,
                            authority_type,
                          } = JSON.parse(JSON.stringify(currentRowData.row));
                          editAuthorityForm.value = {
                            authority_id,
                            authority_pid,
                            authority_title,
                            authority_name,
                            authority_path,
                            authority_type,
                          };
                          isEditAuthorityForm.value = true;
                        } else if (child["text"] === "删除") {
                          ElMessageBox.confirm("确定删除权限吗？", "提示", {
                            type: "error",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            callback: async (action: string) => {
                              if (action === "confirm") {
                                await deleteAuthority({
                                  authority_id: currentRowData.row.authority_id,
                                });
                                reqAuthorityList();
                              }
                            },
                          });
                        } else {
                          if (currentRowData.row.authority_type === 1) {
                            ElMessage.error("操作权限无法添加子权限！");
                            return;
                          }
                          authority_pid.value = currentRowData.row.authority_id;
                          isAddAuthorityForm.value = true;
                        }
                      },
                    },
                  };
                })
                .filter((item) => {
                  if (item.content.text === "编辑") {
                    return userStore.getOperationAuthority.includes("EditAuthority");
                  } else if (item.content.text === "删除") {
                    return userStore.getOperationAuthority.includes("DeleteAuthority");
                  } else {
                    return userStore.getOperationAuthority.includes("AddAuthority");
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
              userStore.getOperationAuthority.includes("EditAuthority") ||
              userStore.getOperationAuthority.includes("DeleteAuthority") ||
              userStore.getOperationAuthority.includes("AddAuthority")
            );
          }
        }),
    };
  });
  // 编辑权限表单配置对象
  const createEditAuthorityForm = computed(() => {
    return {
      mode: editAuthorityForm,
      ref: editAuthorityFormRef,
      attr: {
        size: "default",
        rules: {
          authority_title: [{ required: true, message: "请输入权限标题", trigger: "blur" }],
          authority_name: [{ required: true, message: "请输入权限名", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(editAuthorityForm.value),
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
                        isEditAuthorityForm.value = false;
                      } else {
                        editAuthorityFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await updateAuthority(editAuthorityForm.value);
                          reqAuthorityList();
                          isEditAuthorityForm.value = false;
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
  // 添加权限配置对象
  const createAddAuthorityForm = computed(() => {
    return {
      mode: addAuthorityForm,
      ref: addAuthorityFormRef,
      attr: {
        size: "default",
        rules: {
          authority_id: [{ required: true, message: "请输入权限ID", trigger: "blur" }],
          authority_title: [{ required: true, message: "请输入权限标题", trigger: "blur" }],
          authority_name: [{ required: true, message: "请输入权限名", trigger: "blur" }],
          authority_type: [{ required: true, message: "请输入权限类型", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addAuthorityForm.value),
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
                        isAddAuthorityForm.value = false;
                        authority_pid.value = 0;
                      } else {
                        addAuthorityFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addAuthority({
                            authority_pid: authority_pid.value,
                            ...addAuthorityForm.value,
                          });
                          reqAuthorityList();
                          isAddAuthorityForm.value = false;
                          authority_pid.value = 0;
                          addAuthorityFormRef.value.resetFields();
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
  .authority-list-header {
    display: flex;
    justify-content: space-between;

    h1 {
      font-size: 25px;
      font-weight: 700;
    }
  }
</style>
