<template>
  <el-card class="card-spacing">
    <el-col :span="6" class="search-container">
      <span>宿舍号：</span>
      <el-input
        v-model="dorm"
        placeholder="请输入宿舍号"
        size="default"
        clearable
        @change="getDormList"
      ></el-input>
    </el-col>
  </el-card>
  <el-card>
    <div class="dorm-list-header">
      <h1>宿舍列表</h1>
      <el-button
        v-if="userStore.getOperationAuthority.includes('AddDorm')"
        :color="themeColor"
        @click="isAddDormForm = true"
        >添加宿舍</el-button
      >
    </div>
    <BasicTable :table-option="createDormTable">
      <template #population="scope">
        <div>
          <el-tag v-if="scope.currentCellData.row.dorm_population === 6" type="danger"
            >已满：{{ scope.currentCellData.row.dorm_population }}人</el-tag
          >
          <el-tag v-else type="success"
            >未满：{{ scope.currentCellData.row.dorm_population }}人</el-tag
          >
        </div>
      </template>
      <template #expand="scope">
        <h1 class="dorm-staff-list-title"
          >{{ scope.currentCellData.row.dorm_number }}宿舍人员名单</h1
        >
        <div style="margin: 0 10px 20px">
          <BasicTable :table-option="createStudentTable">
            <template #SexTag="scope">
              <el-tag v-if="scope.currentCellData.row.sex === '男'">男</el-tag>
              <el-tag v-else type="success">女</el-tag>
            </template></BasicTable
          >
        </div>
      </template>
      <template #operation="scope">
        <el-tooltip effect="dark" content="添加宿舍人员" placement="top">
          <el-button
            icon="Plus"
            :color="themeColor"
            :disabled="scope.currentCellData.row.dorm_population === 6"
            @click="addDormStaff(scope.currentCellData.row)"
          ></el-button>
        </el-tooltip>
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
  <el-dialog
    v-model="isAddDormStaffForm"
    :title="addDormStaffForm.telephone === '' ? '添加宿舍人员' : '换宿'"
    width="25%"
    class="dialog-style"
    @close="close"
  >
    <BasicForm :form-option="createAddDormStaffForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddDormForm" title="添加宿舍" width="25%" class="dialog-style">
    <BasicForm :form-option="createAddDormForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeMount, reactive } from "vue";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { getOption } from "@/api/common";
  import { getDorm, getDormStaff, addDorm, changeDorm, checkOut } from "@/api/dorm";
  import { themeColor } from "$styleVariable";
  import { ElMessageBox } from "element-plus";
  import { Delete, Edit } from "@element-plus/icons-vue";

  const getDormList = async () => {
    loading.value = true;
    if (dorm.value !== "") {
      page.value = 1;
    }
    let result = await getDorm({ dorm: dorm.value, page: page.value, pageSize: pageSize.value });
    dormList.value = result.dormInfo;
    total.value = result.total;
    loading.value = false;
  };

  const getStaff = async (val: number) => {
    dormStaffLoading.value = true;
    let result = await getDormStaff({ dorm: val });
    dormStaffList.value = result.dormStaff;
    dormStaffLoading.value = false;
  };

  const getDormStaffList = async (row: any) => {
    if (medianValue.includes(row.dorm_number)) return;
    temp_dorm.value = row.dorm_number;
    medianValue.shift();
    medianValue.unshift(row.dorm_number);
    getStaff(row.dorm_number);
  };

  const addDormStaff = (row: any) => {
    addDormStaffForm.value.dorm = row.dorm_number;
    isAddDormStaffForm.value = true;
  };

  const close = () => {
    addDormStaffForm.value.telephone = "";
    addDormStaffRef.value.resetFields();
  };

  onBeforeMount(() => {
    getDormList();
  });

  const dormList = ref([]);
  const dormStaffList = ref([]);
  const medianValue = reactive([]);
  const dorm = ref("");
  const temp_dorm = ref(0);
  // 分页器总条数
  const total = ref(0);
  // 每页条数
  let pageSize = ref(5);
  // 当前页
  let page = ref(1);
  const loading = ref(false);
  const dormStaffLoading = ref(false);
  const userStore = useUserStoreWithOut();
  const addDormStaffForm = ref({
    usermark: "",
    name: "",
    telephone: "",
    dorm: 0,
  });
  const addDormStaffRef = ref();
  const isAddDormStaffForm = ref(false);
  const addDormForm = ref({
    dorm: "",
  });
  const addDormRef = ref();
  const isAddDormForm = ref(false);
  const selectOptions = ref([]);

  watch(
    page,
    () => {
      medianValue.length > 0 && medianValue.shift();
      getDormList();
    },
    {
      deep: true,
    },
  );

  watch(
    pageSize,
    () => {
      medianValue.length > 0 && medianValue.shift();
      getDormList();
    },
    {
      deep: true,
    },
  );

  const dormTableData = [
    {
      title: "展开行",
    },
    {
      prop: "dorm_number",
      title: "宿舍号",
    },
    {
      prop: "dorm_population",
      title: "宿舍人数",
    },
    {
      title: "操作",
    },
  ];
  const dormStaffTableData = [
    {
      prop: "usermark",
      title: "学生学号",
    },
    {
      prop: "name",
      title: "学生姓名",
    },
    {
      prop: "sex",
      title: "学生性别",
    },
    {
      prop: "telephone",
      title: "学生电话",
    },
    {
      prop: "father",
      title: "学生父亲",
    },
    {
      prop: "father_telephone",
      title: "学生父亲电话",
    },
    {
      prop: "mother",
      title: "学生母亲",
    },
    {
      prop: "mother_telephone",
      title: "学生母亲电话",
    },
    {
      prop: "counselor",
      title: "学生辅导员",
    },
    {
      prop: "counselor_telephone",
      title: "学生辅导员电话",
    },
    {
      title: "操作",
    },
  ];
  const staffForm = {
    usermark: {
      label: "学号",
      placeholder: "请输入学号",
    },
    name: {
      label: "姓名",
      placeholder: "请输入姓名",
    },
    telephone: {
      label: "电话",
      placeholder: "请输入电话",
    },
    dorm: {
      label: "宿舍号",
      placeholder: "请选择宿舍",
    },
  };

  // 宿舍数据表格配置对象
  const createDormTable = computed(() => {
    return {
      data: dormList,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
        rowKey: "dorm_number",
        expandRowKeys: medianValue,
      },
      event: {
        expandChange: getDormStaffList,
      },
      columnArr: dormTableData
        .map((item: any) => {
          if (item["title"] === "展开行") {
            return {
              attr: {
                type: "expand",
              },
              defaultSlotName: "expand",
            };
          } else if (item["title"] === "操作") {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
              },
              defaultSlotName: "operation",
            };
          } else if (item["title"] === "宿舍人数") {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
              },
              defaultSlotName: "population",
            };
          } else {
            return {
              attr: {
                prop: item.prop,
                label: item.title,
                headerAlign: "center",
                align: "center",
              },
            };
          }
        })
        .filter((item: any) => {
          if (item.attr.label !== "操作") return true;
          return userStore.getOperationAuthority.includes("AddDormStaff");
        }),
    };
  });
  // 宿舍人员数据表格配置对象
  const createStudentTable = computed(() => {
    return {
      data: dormStaffList,
      loading: dormStaffLoading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: dormStaffTableData
        .map((item: any) => {
          if (item.title !== "操作") {
            if (item.prop !== "sex") {
              return {
                attr: {
                  prop: item.prop,
                  label: item.title,
                  headerAlign: "center",
                  align: "center",
                  minWidth: "160px",
                  fixed: item.prop === "usermark" ? "left" : false,
                },
              };
            } else {
              return {
                attr: {
                  prop: item.prop,
                  label: item.title,
                  headerAlign: "center",
                  align: "center",
                  width: "100px",
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
                fixed: "right",
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
                      text: child === "Edit" ? "换宿" : "退宿",
                    },
                    event: {
                      click: (currentRowData: any) => {
                        if (child === "Edit") {
                          addDormStaffForm.value.usermark = currentRowData.row.usermark;
                          addDormStaffForm.value.name = currentRowData.row.name;
                          addDormStaffForm.value.telephone = currentRowData.row.telephone;
                          addDormStaffForm.value.dorm = temp_dorm.value;
                          isAddDormStaffForm.value = true;
                        } else {
                          ElMessageBox.confirm("确定将该学生从宿舍中删除吗？", "提示", {
                            type: "error",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            callback: async (action: string) => {
                              if (action === "confirm") {
                                await checkOut({ usermark: currentRowData.row.usermark });
                                getDormList();
                                getStaff(temp_dorm.value);
                              }
                            },
                          });
                        }
                      },
                    },
                  };
                })
                .filter((item: any) => {
                  if (item.content.text === "换宿") {
                    return userStore.getOperationAuthority.includes("ChangeDorm");
                  } else {
                    return userStore.getOperationAuthority.includes("CheckOut");
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
              userStore.getOperationAuthority.includes("ChangeDorm") ||
              userStore.getOperationAuthority.includes("CheckOut")
            );
          }
        }),
    };
  });
  // 表单项配置对象
  const renderItemArr = (obj: any) => {
    return Object.keys(obj).map((key: string) => {
      if (key === "telephone") return [];
      if (key === "usermark" || key === "name") {
        return [
          {
            attr: {
              prop: key,
              label: staffForm[key].label,
            },
            component: {
              comp: "el-input",
              attr: {
                size: "default",
                placeholder: staffForm[key].placeholder,
                disabled: obj["telephone"] !== "",
              },
            },
          },
        ];
      } else {
        return [
          {
            attr: {
              prop: key,
              label: staffForm[key].label,
            },
            component: {
              comp: "el-select",
              attr: {
                size: "default",
                placeholder: staffForm[key].placeholder,
                clearable: true,
                disabled: obj["telephone"] === "",
                style: {
                  width: "100%",
                },
              },
              event: {
                visibleChange: async (val: boolean) => {
                  if (val) {
                    if (selectOptions.value.length !== 0) return;
                    let result = await getOption({ key: "dorm" });
                    selectOptions.value = result.selectOptions;
                  }
                },
              },
              children: selectOptions.value.map((option: any) => {
                return {
                  comp: "el-option",
                  attr: {
                    label: option.dorm_number,
                    value: option.dorm_number,
                  },
                };
              }),
            },
          },
        ];
      }
    });
  };
  // 添加宿舍人员/换宿表单配置对象
  const createAddDormStaffForm = computed(() => {
    return {
      mode: addDormStaffForm,
      ref: addDormStaffRef,
      attr: {
        size: "default",
        rules: {
          usermark: [{ required: true, message: "请输入学生学号", trigger: "blur" }],
          name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
          dorm: [{ required: true, message: "请输入新增房间号", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addDormStaffForm.value),
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
                        addDormStaffForm.value.telephone = "";
                        addDormStaffRef.value.resetFields();
                        isAddDormStaffForm.value = false;
                      } else {
                        addDormStaffRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await changeDorm({
                            key: addDormStaffForm.value.telephone === "" ? "添加宿舍人员" : "换宿",
                            ...addDormStaffForm.value,
                          });
                          getDormList();
                          temp_dorm.value && getStaff(temp_dorm.value);
                          isAddDormStaffForm.value = false;
                          addDormStaffRef.value.resetFields();
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
  // 添加宿舍表单配置对象
  const createAddDormForm = computed(() => {
    return {
      mode: addDormForm,
      ref: addDormRef,
      attr: {
        size: "default",
        rules: {
          dorm: [{ required: true, message: "请输入新增房间号", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        [
          {
            attr: {
              prop: "dorm",
              label: staffForm["dorm"].label,
            },
            component: {
              comp: "el-input",
              attr: {
                size: "default",
                placeholder: "请输入新增房间号",
              },
            },
          },
        ],
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
                        isAddDormForm.value = false;
                        addDormRef.value.resetFields();
                      } else {
                        addDormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addDorm(addDormForm.value);
                          getDormList();
                          isAddDormForm.value = false;
                          addDormStaffRef.value.resetFields();
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

  .search-container {
    display: flex;
    align-items: center;

    span {
      white-space: nowrap;
      margin-right: 5px;
    }
  }

  .dorm-list-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    h1 {
      font-size: 25px;
      font-weight: 700;
      margin-right: 10px;
    }
  }

  .dorm-staff-list-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 10px;
  }
</style>
