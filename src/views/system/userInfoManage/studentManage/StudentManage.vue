<template>
  <el-card class="card-spacing">
    <BasicForm :form-option="createSearchForm"></BasicForm>
  </el-card>
  <el-card>
    <BasicTable :table-option="createStudentTable">
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
  <el-dialog v-model="isEditStudentForm" title="编辑学生信息" width="40%" class="dialog-style">
    <BasicForm :form-option="createEditStudentForm"></BasicForm>
  </el-dialog>
  <el-dialog v-model="isAddStudentForm" title="添加学生信息" width="40%" class="dialog-style">
    <BasicForm :form-option="createAddStudentForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { type Ref, ref, computed, onBeforeMount, watch } from "vue";
  import { getStudentDataList, deleteStudent, updateStudent, addStudent } from "@/api/userInfo";
  import { getOption } from "@/api/common";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { ElMessageBox } from "element-plus";
  import { Delete, Edit, Plus } from "@element-plus/icons-vue";
  import { checkTelephone, checkEmail } from "@/utils/validator";
  import { themeColor } from "$styleVariable";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  interface StudentDataType {
    usermark: string;
    name: string;
    sex: string;
    telephone: string;
    email: string;
    role: string;
  }

  const getStudentData = async () => {
    loading.value = true;
    let params = {
      college: searchForm.value.college,
      class: searchForm.value.class,
      dorm_build: searchForm.value.dorm_build,
      dorm: searchForm.value.dorm,
      usermark: searchForm.value.usermark,
      name: searchForm.value.name,
      page: page.value,
      pageSize: pageSize.value,
    };
    let result = await getStudentDataList(params);
    studentData.value = result.studentData;
    total.value = result.total;
    loading.value = false;
  };

  onBeforeMount(() => {
    getStudentData();
  });

  // 分页器总条数
  const total = ref(0);
  // 每页条数
  let pageSize = ref(7);
  // 当前页
  let page = ref(1);
  const loading = ref(true);
  const userStore = useUserStoreWithOut();

  const studentData: Ref<Array<StudentDataType>> = ref([]);
  const studentDataArr = [
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
      prop: "email",
      title: "学生邮箱",
    },
    {
      prop: "college",
      title: "学生所在学院",
    },
    {
      prop: "class",
      title: "学生所在班级",
    },
    {
      prop: "dorm_build",
      title: "学生所在宿舍楼",
    },
    {
      prop: "dorm",
      title: "学生所在宿舍房间",
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
  const searchForm = ref({
    college: "",
    class: "",
    dorm_build: "",
    dorm: "",
    usermark: "",
    name: "",
  });
  const editStudentForm = ref({});
  const editStudentFormRef = ref();
  const isEditStudentForm = ref(false);
  const addStudentForm = ref({
    name: "",
    sex: "",
    telephone: "",
    email: "",
    college: "",
    class: "",
    dorm_build: "",
    dorm: "",
    counselor: "",
    counselor_telephone: "",
  });
  const addStudentFormRef = ref();
  const isAddStudentForm = ref(false);
  const selectOptions = ref({
    college: [],
    dorm_build: [],
  });

  watch(
    page,
    () => {
      getStudentData();
    },
    {
      deep: true,
    },
  );

  watch(
    pageSize,
    () => {
      getStudentData();
    },
    {
      deep: true,
    },
  );
  // 学生数据表格配置对象
  const createStudentTable = computed(() => {
    return {
      data: studentData,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: studentDataArr
        .map((item: any) => {
          if (item.title !== "操作") {
            if (item.prop !== "sex") {
              return {
                attr: {
                  prop: item.prop,
                  label: item.title,
                  headerAlign: "center",
                  align: "center",
                  width: item.prop === "email" || item.prop === "college" ? "220px" : "150px",
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
                      text: child === "Edit" ? "编辑" : "删除",
                    },
                    event: {
                      click: (currentRowData: any) => {
                        if (child === "Edit") {
                          editStudentForm.value = JSON.parse(JSON.stringify(currentRowData.row));
                          isEditStudentForm.value = true;
                        } else {
                          ElMessageBox.confirm("确定删除学生信息吗？", "提示", {
                            type: "error",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            callback: async (action: string) => {
                              if (action === "confirm") {
                                await deleteStudent({ usermark: currentRowData.row.usermark });
                                getStudentData();
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
                    return userStore.getOperationAuthority.includes("EditStudentInfo");
                  } else {
                    return userStore.getOperationAuthority.includes("DeleteStudentInfo");
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
              userStore.getOperationAuthority.includes("EditStudentInfo") ||
              userStore.getOperationAuthority.includes("DeleteStudentInfo")
            );
          }
        }),
    };
  });
  const title = {
    usermark: {
      label: "学生学号",
      placeholder: "请输入学生学号",
    },
    name: {
      label: "学生姓名",
      placeholder: "请输入学生姓名",
    },
    sex: {
      label: "学生性别",
      placeholder: "请输入学生性别",
    },
    telephone: {
      label: "学生电话",
      placeholder: "请输入学生电话",
    },
    email: {
      label: "学生邮箱",
      placeholder: "请输入学生邮箱",
    },
    college: {
      label: "学生所在学院",
      placeholder: "请选择学生所在学院",
    },
    class: {
      label: "学生所在班级",
      placeholder: "请选择学生所在班级",
    },
    dorm_build: {
      label: "学生所在宿舍楼",
      placeholder: "请选择学生所在宿舍楼",
    },
    dorm: {
      label: "学生所在房间",
      placeholder: "请选择学生所在房间",
    },
    father: {
      label: "学生父亲",
      placeholder: "请输入学生父亲",
    },
    father_telephone: {
      label: "学生父亲电话",
      placeholder: "请输入学生父亲电话",
    },
    mother: {
      label: "学生母亲",
      placeholder: "请输入学生母亲",
    },
    mother_telephone: {
      label: "学生母亲电话",
      placeholder: "请输入学生母亲电话",
    },
    counselor: {
      label: "学生辅导员",
      placeholder: "请输入学生辅导员",
    },
    counselor_telephone: {
      label: "学生辅导员电话",
      placeholder: "请输入学生辅导员电话",
    },
  };
  // 表单项配置对象
  const renderItemArr = (obj: any) => {
    let select = ["college", "dorm_build"];
    let itemArr: Array<T> = [[]];
    Object.keys(obj).forEach((key: string) => {
      if (key === "usermark" || key === "name" || key === "sex") {
        itemArr[0].push({
          span: Object.keys(obj).includes("counselor")
            ? Object.keys(obj).includes("usermark")
              ? 8
              : 12
            : 6,
          attr: {
            prop: key,
            label: title[key].label,
            labelWidth: Object.keys(obj).includes("counselor")
              ? Object.keys(obj).includes("usermark")
                ? "80px"
                : "110px"
              : "110px",
          },
          component: {
            comp: key === "sex" ? "el-select" : "el-input",
            attr: {
              size: "default",
              placeholder: title[key].placeholder,
              disabled: key === "usermark" && Object.keys(obj).includes("counselor"),
              clearable: key === "sex" ? true : false,
              style: {
                width: "100%",
              },
            },
            event: {
              change: () => {
                !Object.keys(obj).includes("counselor") && getStudentData();
              },
            },
            children:
              key === "sex" &&
              ["男", "女"].map((option: string) => {
                return {
                  comp: "el-option",
                  attr: {
                    label: option,
                    value: option,
                  },
                };
              }),
          },
        });
      } else if (select.includes(key)) {
        itemArr[0].push({
          span: Object.keys(obj).includes("counselor") ? 12 : 6,
          attr: {
            prop: key,
            label: title[key].label,
          },
          component: {
            comp: "el-select",
            attr: {
              size: "default",
              placeholder: title[key].placeholder,
              clearable: true,
              style: {
                width: "100%",
              },
            },
            event: {
              visibleChange: async (val: boolean) => {
                if (val) {
                  let result = await getOption({ key });
                  selectOptions.value[key] = result.selectOptions;
                }
              },
              change: () => {
                !Object.keys(obj).includes("counselor") && getStudentData();
              },
            },
            children: selectOptions.value[key].map((option: any) => {
              return {
                comp: "el-option",
                attr: {
                  label: key === "college" ? option.college_name : option.dorm_build_name,
                  value: key === "college" ? option.college_name : option.dorm_build_name,
                },
              };
            }),
          },
        });
      } else {
        itemArr[0].push({
          span: Object.keys(obj).includes("counselor") ? 12 : 6,
          attr: {
            prop: key,
            label: title[key]["label"],
          },
          component: {
            comp: "el-input",
            attr: {
              size: "default",
              placeholder: title[key]["placeholder"],
            },
            event: {
              change: () => {
                !Object.keys(obj).includes("counselor") && getStudentData();
              },
            },
          },
        });
      }
    });
    if (!Object.keys(obj).includes("counselor") && userStore.getOperationAuthority.includes("AddStudentInfo")) {
      itemArr[0].push({
        span: 12,
        attr: {
          labelWidth: "50px",
        },
        component: {
          comp: "div",
          children: [
            {
              comp: "el-button",
              attr: {
                icon: Plus,
                color: themeColor,
                style: {
                  marginLeft: "30px",
                },
              },
              event: {
                click: () => {
                  isAddStudentForm.value = true;
                },
              },
              content: {
                text: "添加学生",
              },
            },
          ],
        },
      });
    }
    return itemArr;
  };
  // 搜索表单配置对象
  const createSearchForm = computed(() => {
    return {
      mode: searchForm,
      attr: {
        size: "default",
        labelWidth: "110px",
        labelPosition: "left",
      },
      itemArr: renderItemArr(searchForm.value),
    };
  });
  // 编辑表单配置对象
  const createEditStudentForm = computed(() => {
    return {
      mode: editStudentForm,
      ref: editStudentFormRef,
      attr: {
        size: "default",
        rules: {
          name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
          sex: [{ required: true, message: "请选择学生性别", trigger: "blur" }],
          email: [
            { required: true, message: "请输入学生邮箱", trigger: "blur" },
            { validator: checkEmail, message: "邮箱格式错误！", trigger: "blur" },
          ],
          telephone: [
            { required: true, message: "请输入学生电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          college: [{ required: true, message: "请选择学生所在学院", trigger: "blur" }],
          class: [{ required: true, message: "请选择学生所在班级", trigger: "blur" }],
          dorm: [{ required: true, message: "请选择学生所在宿舍房间", trigger: "blur" }],
          dorm_build: [{ required: true, message: "请选择学生所在宿舍楼", trigger: "blur" }],
          father: [{ required: true, message: "请输入学生父亲姓名", trigger: "blur" }],
          father_telephone: [
            { required: true, message: "请输入学生父亲电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          mother: [{ required: true, message: "请输入学生母亲姓名", trigger: "blur" }],
          mother_telephone: [
            { required: true, message: "请输入学生母亲电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          counselor: [{ required: true, message: "请输入学生辅导员姓名", trigger: "blur" }],
          counselor_telephone: [
            { required: true, message: "请输入学生辅导员电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
        },
        hideRequiredAsterisk: true,
        labelWidth: "110px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(editStudentForm.value),
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
                        isEditStudentForm.value = false;
                      } else {
                        editStudentFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await updateStudent(editStudentForm.value);
                          getStudentData();
                          isEditStudentForm.value = false;
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
  // 添加表单配置对象
  const createAddStudentForm = computed(() => {
    return {
      mode: addStudentForm,
      ref: addStudentFormRef,
      attr: {
        size: "default",
        rules: {
          name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
          sex: [{ required: true, message: "请选择学生性别", trigger: "blur" }],
          email: [
            { required: true, message: "请输入学生邮箱", trigger: "blur" },
            { validator: checkEmail, message: "邮箱格式错误！", trigger: "blur" },
          ],
          telephone: [
            { required: true, message: "请输入学生电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
          college: [{ required: true, message: "请选择学生所在学院", trigger: "blur" }],
          class: [{ required: true, message: "请选择学生所在班级", trigger: "blur" }],
          dorm: [{ required: true, message: "请选择学生所在宿舍房间", trigger: "blur" }],
          dorm_build: [{ required: true, message: "请选择学生所在宿舍楼", trigger: "blur" }],
          counselor: [{ required: true, message: "请输入学生辅导员姓名", trigger: "blur" }],
          counselor_telephone: [
            { required: true, message: "请输入学生辅导员电话", trigger: "blur" },
            { validator: checkTelephone, message: "手机格式错误！", trigger: "blur" },
          ],
        },
        hideRequiredAsterisk: true,
        labelWidth: "110px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(addStudentForm.value),
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
                        isAddStudentForm.value = false;
                        addStudentFormRef.value.resetFields();
                      } else {
                        addStudentFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          await addStudent(addStudentForm.value);
                          getStudentData();
                          isAddStudentForm.value = false;
                          addStudentFormRef.value.resetFields();
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
  :deep(.el-form-item__label) {
    margin-right: 0px;
    margin-left: 10px;
  }

  .el-pagination {
    margin: 15px 0 0;
    justify-content: center;
  }
</style>
