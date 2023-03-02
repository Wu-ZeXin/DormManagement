<template>
  <el-card class="card-spacing">
    <BasicForm :form-option="createSearchDormBuildForm"></BasicForm>
  </el-card>
  <el-card>
    <div class="dorm-list-header">
      <h1>宿舍楼列表</h1>
      <el-button
        v-if="userStore.getOperationAuthority.includes('AddDormBuildInfo')"
        :color="themeColor"
        icon="Plus"
        @click="isAddDormBuildForm = true"
        >添加宿舍楼</el-button
      >
    </div>
    <BasicTable :table-option="createDormBuildTable">
      <template #SexTag="scope">
        <el-tag v-if="scope.currentCellData.row.sex === '男'">男</el-tag>
        <el-tag v-else type="success">女</el-tag>
      </template>
    </BasicTable>
    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="page"
      :page-sizes="[5, 10, 15]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :background="true"
    />
  </el-card>
  <el-dialog v-model="isEditDormBuildForm" title="编辑角色" width="25%">
    <BasicForm :form-option="createEditDormBuildForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddDormBuildForm" title="添加角色" width="25%">
    <BasicForm :form-option="createAddDormBuildForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeMount } from "vue";
  import { getDormBuild, addDormBuild, deleteDormBuild, updateDormBuild } from "@/api/dorm_build.js";
  import { getOption } from "@/api/common";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { themeColor } from "$styleVariable";
  import { Delete, Edit } from "@element-plus/icons-vue";
  import { ElMessageBox } from "element-plus";

  const getDormBuildData = async () => {
    let result = await getDormBuild({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    total.value = result.total;
    dormBuildData.value = result.dormBuildInfo;
  };

  onBeforeMount(() => {
    getDormBuildData();
  });

  // 分页器总条数
  const total = ref(0);
  // 每页条数
  let pageSize = ref(5);
  // 当前页
  let page = ref(1);
  const loading = ref(false);
  const userStore = useUserStoreWithOut();
  const editDormBuildForm = ref({});
  const editDormBuildFormRef = ref();
  const isEditDormBuildForm = ref(false);
  const addDormBuildForm = ref({
    dorm_build_name: "",
    dorm_build_manager: "",
  });
  const addDormBuildFormRef = ref();
  const isAddDormBuildForm = ref(false);
  const dormBuildSelectOptions = ref([]);

  const searchForm = ref({
    dorm_build_name: "",
    dorm_build_manager: "",
  });
  const searchFormRef = ref();

  watch(
    page,
    () => {
      getDormBuildData();
    },
    {
      deep: true,
    },
  );

  watch(
    pageSize,
    () => {
      getDormBuildData();
    },
    {
      deep: true,
    },
  );

  const dormBuildData = ref([]);
  const DormBuildTableData = [
    {
      prop: "dorm_build_name",
      title: "宿舍楼",
    },
    {
      prop: "usermark",
      title: "负责人",
    },
    {
      prop: "sex",
      title: "性别",
    },
    {
      prop: "telephone",
      title: "联系电话",
    },
    {
      title: "操作",
    },
  ];
  const dormBuildFormData = {
    dorm_build_name: {
      label: "宿舍楼",
      placeholder: "请输入宿舍楼名",
    },
    dorm_build_manager: {
      label: "负责人",
      placeholder: "请输入负责人",
    },
    usermark: {
      label: "负责人",
      placeholder: "请输入负责人",
    },
    sex: {
      label: "性别",
      placeholder: "请输入负责人性别",
    },
    telephone: {
      label: "联系电话",
      placeholder: "请输入负责联系电话",
    },
  };

  // 宿舍楼信息表格配置对象
  const createDormBuildTable = computed(() => {
    return {
      data: dormBuildData,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: DormBuildTableData.map((item: any) => {
        if (item.title !== "操作") {
          if (item.prop !== "sex") {
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
                        editDormBuildForm.value = JSON.parse(JSON.stringify(currentRowData.row));
                        isEditDormBuildForm.value = true;
                      } else {
                        ElMessageBox.confirm("确定删除职工信息吗？", "提示", {
                          type: "error",
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          callback: async (action: string) => {
                            if (action === "confirm") {
                              await deleteDormBuild({ dorm_build_id: currentRowData.row.dorm_build_id });
                              getDormBuildData();
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
                  return userStore.getOperationAuthority.includes("EditDormBuildInfo");
                } else {
                  return userStore.getOperationAuthority.includes("DeleteDormBuildInfo");
                }
              }),
          };
        }
      }).filter((item: any) => {
        if (item.attr.label !== "操作") {
          return true;
        } else {
          return (
            userStore.getOperationAuthority.includes("EditDormBuildInfo") ||
            userStore.getOperationAuthority.includes("DeleteDormBuildInfo")
          );
        }
      }),
    };
  });
  const renderItemArr = (obj: any) => {
    return Object.keys(obj).map((key: string) => {
      if (key === "name" || key === "dorm_build_id") return [];
      if (key !== "dorm_build_manager" && key !== "usermark") {
        return [
          {
            attr: {
              prop: key,
              label: dormBuildFormData[key]["label"],
            },
            component: {
              comp: "el-input",
              attr: {
                size: "default",
                placeholder: dormBuildFormData[key]["placeholder"],
                disabled: Object.keys(obj).includes("usermark"),
                clearable: true,
              },
            },
          },
        ];
      } else {
        return [
          {
            attr: {
              prop: key,
              label: dormBuildFormData[key]["label"],
            },
            component: {
              comp: "el-select",
              attr: {
                size: "default",
                placeholder: dormBuildFormData[key]["placeholder"],
                style: {
                  width: "100%",
                },
                clearable: true,
              },
              event: {
                visibleChange: async (val: boolean) => {
                  if (val) {
                    if (dormBuildSelectOptions.value.length !== 0) return;
                    let result = await getOption({ key: "dorm_manager" });
                    dormBuildSelectOptions.value = result.selectOptions;
                  }
                },
              },
              children: dormBuildSelectOptions.value.map((option: any) => {
                return {
                  comp: "el-option",
                  attr: {
                    label: option.name,
                    value: option.usermark,
                  },
                  children: [
                    {
                      comp: "span",
                      attr: {
                        style: {
                          float: "left",
                        },
                      },
                      content: {
                        text: option.usermark,
                      },
                    },
                    {
                      comp: "span",
                      attr: {
                        style: {
                          float: "right",
                          fontSize: "13px",
                          color: "#909399",
                        },
                      },
                      content: {
                        text: option.name,
                      },
                    },
                  ],
                };
              }),
            },
          },
        ];
      }
    });
  };
  // 搜索宿舍楼信息表单配置对象
  const createSearchDormBuildForm = computed(() => {
    let itemArr = renderItemArr(searchForm.value);
    itemArr.forEach((item) => (item[0]["span"] = 6));
    itemArr.push([
      {
        component:{
          comp:  "el-button",
          attr: {
            color: themeColor,
            icon: "Search"
          },
          content: {
            text: "搜索"
          },
          event: {
            click: function() {
              getDormBuildData();
            }
          }
        }
      }
    ])
    return {
      mode: searchForm,
      ref: searchFormRef,
      attr: {
        size: "default",
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "right",
      },
      itemArr: [itemArr.flat()],
    };
  });
  // 编辑宿舍楼信息表单配置对象
  const createEditDormBuildForm = computed(() => {
    return {
      mode: editDormBuildForm,
      ref: editDormBuildFormRef,
      attr: {
        size: "default",
        rules: {
          name: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(editDormBuildForm.value),
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
                        isEditDormBuildForm.value = false;
                      } else {
                        editDormBuildFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          console.log(editDormBuildForm.value)
                          await updateDormBuild(editDormBuildForm.value);
                          getDormBuildData();
                          isEditDormBuildForm.value = false;
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
  // 添加宿舍楼信息配置对象
  const createAddDormBuildForm = computed(() => {
    return {
      mode: addDormBuildForm,
      ref: addDormBuildFormRef,
      attr: {
        size: "default",
        rules: {
          dorm_build_name: [{ required: true, message: "请输入宿舍楼名", trigger: "blur" }],
          dorm_build_manager: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addDormBuildForm.value),
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
                        isAddDormBuildForm.value = false;
                      } else {
                        addDormBuildFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addDormBuild(addDormBuildForm.value);
                          getDormBuildData();
                          isAddDormBuildForm.value = false;
                          addDormBuildFormRef.value.resetFields();
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
  .dorm-list-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 25px;
      font-weight: 700;
      margin-right: 20px;
    }
  }

  .el-pagination {
    margin: 15px 0 0;
    justify-content: center;
  }
</style>
