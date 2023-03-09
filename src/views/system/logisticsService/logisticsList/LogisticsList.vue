<template>
  <el-card class="card-spacing">
    <BasicForm :form-option="createSearchForm"></BasicForm>
  </el-card>
  <el-card>
    <BasicTable :table-option="createRepairBillsTable">
      <template #operation="scope">
        <el-switch
          v-if="userStore.getOperationAuthority.includes('ChangeRepairStatus')"
          v-model="scope.currentCellData.row.repair_status"
          :active-value="1"
          :inactive-value="0"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; margin-right: 12px"
          :disabled="scope.currentCellData.row.repair_status === 1"
          :before-change="changeSwitch"
          @change="changeRepairStatus(scope.currentCellData.row)"
        />
        <el-button
          v-if="userStore.getOperationAuthority.includes('EditRepairBill')"
          type="warning"
          icon="Edit"
          link
          @click="editRepairBill(scope.currentCellData.row)"
          >编辑</el-button
        >
        <el-button
          v-if="userStore.getOperationAuthority.includes('DeleteRepairBill')"
          type="danger"
          icon="Delete"
          link
          @click="deleteRepair(scope.currentCellData.row)"
          >删除</el-button
        >
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
  <el-dialog v-model="isEditRepairBillForm" title="编辑报修单信息" width="40%">
    <BasicForm :form-option="createEditRepairBillsForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onBeforeMount } from "vue";
  import { getOption } from "@/api/common";
  import {
    getRepairBill,
    updateRepairBillStatus,
    deleteRepairBill,
    updateRepairBill,
  } from "@/api/repair";
  import { themeColor } from "$styleVariable";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { checkTelephone } from "@/utils/validator";

  const getRepairBillList = async () => {
    let result = await getRepairBill({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    total.value = result.total;
    repairBillsData.value = result.repairBills;
  };

  const changeSwitch = () => {
    return ElMessageBox.confirm("确定维修完成了吗？（点击后不可改变）", "提示", {
      type: "error",
      buttonSize: "default",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });
  };

  const deleteRepair = (row: any) => {
    ElMessageBox.confirm("确定删除本条报修单吗？", "提示", {
      type: "error",
      buttonSize: "default",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      callback: async (action: string) => {
        if (action === "confirm") {
          await deleteRepairBill({ repair_id: row.repair_id });
          getRepairBillList();
        }
      },
    });
  };

  const editRepairBill = (row: any) => {
    editRepairBillsForm.value = JSON.parse(JSON.stringify(row));
    currentSelect.first_repair_type = "";
    currentSelect.repair_dorm_build = "";
    isEditRepairBillForm.value = true;
  };

  const changeRepairStatus = async (row: any) => {
    if (row.repair_status === 0) return;
    await updateRepairBillStatus({ repair_id: row.repair_id });
  };

  onBeforeMount(() => {
    getRepairBillList();
  });

  // 分页器总条数
  const total = ref(0);
  // 每页条数
  let pageSize = ref(5);
  // 当前页
  let page = ref(1);
  const loading = ref(false);
  const userStore = useUserStoreWithOut();

  const searchForm = ref({
    first_repair_type: "",
    secondary_repair_type: "",
    repair_dorm_build: "",
    repair_dorm: "",
    repair_status: "",
  });

  watch(
    page,
    () => {
      getRepairBillList();
    },
    {
      deep: true,
    },
  );

  watch(
    pageSize,
    () => {
      getRepairBillList();
    },
    {
      deep: true,
    },
  );

  const repairBillsData = ref([]);
  const repairBillsTableData = [
    {
      prop: "contact_person",
      title: "联系人",
    },
    {
      prop: "contact_telephone",
      title: "联系电话",
    },
    {
      prop: "first_repair_type",
      title: "一级维修类型",
    },
    {
      prop: "secondary_repair_type",
      title: "二级维修类型",
    },
    {
      prop: "repair_dorm_build",
      title: "宿舍楼",
    },
    {
      prop: "repair_dorm",
      title: "宿舍房间",
    },
    {
      prop: "repair_time",
      title: "报修时间",
    },
    {
      prop: "repair_description",
      title: "详细描述",
    },
    {
      prop: "repair_status",
      title: "操作",
    },
  ];

  // 宿舍楼信息表格配置对象
  const createRepairBillsTable = computed(() => {
    return {
      data: repairBillsData,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: repairBillsTableData
        .map((item: any) => {
          if (item.title !== "操作") {
            return {
              attr: {
                prop: item.prop,
                label: item.title,
                headerAlign: "center",
                align: item.prop === "repair_description" ? "left" : "center",
                width: item.prop === "repair_description" ? "450px" : "180px",
              },
            };
          } else {
            return {
              attr: {
                label: item.title,
                headerAlign: "center",
                align: "center",
                width: "200px",
                fixed: "right",
              },
              defaultSlotName: "operation",
            };
          }
        })
        .filter((item: any) => {
          if (item.attr.label !== "操作") {
            return true;
          } else {
            return (
              userStore.getOperationAuthority.includes("EditRepairBill") ||
              userStore.getOperationAuthority.includes("DeleteRepairBill") ||
              userStore.getOperationAuthority.includes("ChangeRepairStatus")
            );
          }
        }),
    };
  });
  const editRepairBillsForm = ref({});
  const isEditRepairBillForm = ref(false);
  const editRepairBillsFormRef = ref();
  const editRepairBillsFormData = {
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
    repair_status: {
      label: "报修状态",
      placeholder: "请选择报修状态",
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
      if (key === "repair_id" || key === "repair_time") return [];
      if (key === "repair_description") {
        itemArr[0].push({
          span: 24,
          attr: {
            prop: key,
            label: editRepairBillsFormData[key].label,
          },
          component: {
            comp: "el-input",
            attr: {
              type: "textarea",
              rows: 10,
              placeholder: editRepairBillsFormData[key].placeholder,
            },
          },
        });
      } else if (select.includes(key)) {
        itemArr[0].push({
          span: Object.keys(obj).includes("repair_id") ? 12 : (userStore.getOperationAuthority.includes("SearchByDormBuild") ? 6 : 5),
          attr: {
            prop: key,
            label: editRepairBillsFormData[key].label,
          },
          component: {
            comp: "el-select",
            attr: {
              placeholder: editRepairBillsFormData[key].placeholder,
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
                        editRepairBillsForm.value.first_repair_type &&
                      currentSelect.first_repair_type !== ""
                    )
                      return;
                    if (
                      currentSelect.first_repair_type === searchForm.value.first_repair_type &&
                      currentSelect.first_repair_type !== ""
                    )
                      return;
                    selectOptions.secondary_repair_type = [];
                    if (
                      editRepairBillsForm.value.first_repair_type === "" ||
                      searchForm.value.first_repair_type === ""
                    ) {
                      ElMessage.warning("请先选择一级报修类型");
                      return;
                    }
                    selectKey = Object.keys(obj).includes("repair_id")
                      ? editRepairBillsForm.value.first_repair_type
                      : searchForm.value.first_repair_type;
                    currentSelect.repair_dorm_build = Object.keys(obj).includes("repair_id")
                      ? editRepairBillsForm.value.first_repair_type
                      : searchForm.value.first_repair_type;
                  } else {
                    if (
                      currentSelect.repair_dorm_build ===
                        editRepairBillsForm.value.repair_dorm_build &&
                      currentSelect.repair_dorm_build !== ""
                    )
                      return;
                    if (
                      currentSelect.repair_dorm_build === searchForm.value.repair_dorm_build &&
                      currentSelect.repair_dorm_build !== ""
                    )
                      return;
                    selectOptions.repair_dorm = [];
                    if (editRepairBillsForm.value.repair_dorm_build === "") {
                      ElMessage.warning("请先选择报修楼栋");
                      return;
                    }
                    if (
                      searchForm.value.repair_dorm_build === "" &&
                      userStore.getOperationAuthority.includes("SearchByDormBuild")
                    ) {
                      ElMessage.warning("请先选择报修楼栋");
                      return;
                    }
                    selectKey = Object.keys(obj).includes("repair_id")
                      ? editRepairBillsForm.value.repair_dorm_build
                      : userStore.getOperationAuthority.includes("SearchByDormBuild")
                      ? searchForm.value.repair_dorm_build
                      : "SelectByUsermark";
                    currentSelect.repair_dorm_build = Object.keys(obj).includes("repair_id")
                      ? editRepairBillsForm.value.repair_dorm_build
                      : searchForm.value.repair_dorm_build;
                  }
                  let result = await getOption({ key, selectKey });
                  selectOptions[key] = result.selectOptions;
                }
              },
              change: () => {
                if (key === "first_repair_type") {
                  editRepairBillsForm.value.secondary_repair_type = "";
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
      } else if (key === "repair_status") {
        if (Object.keys(obj).includes("repair_id")) return [];
        itemArr[0].push({
          span: Object.keys(obj).includes("repair_id") ? 12 : (userStore.getOperationAuthority.includes("SearchByDormBuild") ? 6 : 5),
          attr: {
            prop: key,
            label: editRepairBillsFormData[key].label,
          },
          component: {
            comp: "el-select",
            attr: {
              placeholder: editRepairBillsFormData[key].placeholder,
              clearable: true,
              style: {
                width: "100%",
              },
            },
            children: [
              ["已完成", 1],
              ["未完成", 0],
            ].map((option: any) => {
              return {
                comp: "el-option",
                attr: {
                  label: option[0],
                  value: option[1],
                },
              };
            }),
          },
        });
      } else {
        itemArr[0].push({
          span: Object.keys(obj).includes("repair_id") ? 12 : 6,
          attr: {
            prop: key,
            label: editRepairBillsFormData[key]["label"],
          },
          component: {
            comp: "el-input",
            attr: {
              placeholder: editRepairBillsFormData[key]["placeholder"],
            },
          },
        });
      }
    });
    if (!Object.keys(obj).includes("repair_id")) {
      itemArr[0].push({
        span: userStore.getOperationAuthority.includes("SearchByDormBuild") ? 18 : 4,
        attr: {
          labelWidth: "50px",
        },
        component: {
          comp: "div",
          children: [
            {
              comp: "el-button",
              attr: {
                color: themeColor,
                icon: "Search",
              },
              content: {
                text: "搜索",
              },
              event: {
                click: getRepairBillList,
              },
            },
          ],
        },
      });
    }
    return itemArr;
  };
  // 编辑表单配置对象
  const createEditRepairBillsForm = computed(() => {
    return {
      mode: editRepairBillsForm,
      ref: editRepairBillsFormRef,
      attr: {
        size: "default",
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
          repair_dorm_build: [{ required: true, message: "请选择报修楼栋", trigger: "blur" }],
          repair_dorm: [{ required: true, message: "请选择报修宿舍", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "110px",
        labelPosition: "right",
      },
      itemArr: [
        ...renderItemArr(editRepairBillsForm.value),
        [
          {
            component: {
              comp: "div",
              attr: {
                style: {
                  marginLeft: "auto",
                },
              },
              children: ["取消", "提交"].map((key: string) => {
                return {
                  comp: "el-button",
                  attr: {
                    size: "default",
                    color: key === "提交" ? themeColor : "",
                  },
                  event: {
                    click: () => {
                      if (key === "取消") {
                        currentSelect.first_repair_type = "";
                        currentSelect.repair_dorm_build = "";
                        isEditRepairBillForm.value = false;
                        editRepairBillsFormRef.value.resetFields();
                      } else {
                        editRepairBillsFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await updateRepairBill(editRepairBillsForm.value);
                          currentSelect.first_repair_type = "";
                          currentSelect.repair_dorm_build = "";
                          isEditRepairBillForm.value = false;
                          editRepairBillsFormRef.value.resetFields();
                          getRepairBillList();
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
  // 编辑表单配置对象
  const createSearchForm = computed(() => {
    let itemArr = renderItemArr(searchForm.value);
    itemArr = itemArr[0].filter((item: any) => {
      if (item.attr.prop === "repair_dorm_build") {
        return userStore.getOperationAuthority.includes("SearchByDormBuild");
      } else {
        return true;
      }
    });
    return {
      mode: searchForm,
      attr: {
        size: "default",
        hideRequiredAsterisk: true,
        labelWidth: "100px",
        labelPosition: "right",
      },
      itemArr: [itemArr],
    };
  });
</script>

<style scoped lang="less">
  .el-pagination {
    margin: 15px 0 20px;
    justify-content: center;
  }

  :deep(.el-card__body) {
    padding-bottom: 0px;
  }
</style>
