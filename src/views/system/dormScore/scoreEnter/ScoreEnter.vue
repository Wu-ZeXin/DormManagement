<template>
  <el-card>
    <div class="title-container">
      <span class="item">{{ year }}年{{ month }}月宿舍评分</span>
      <el-date-picker
        v-model="selectMonth"
        type="month"
        size="default"
        :clearable="false"
        placeholder="请选择查看月份"
        @change="changeMonth"
        style="margin-right: 10px"
      />
      <el-button :color="themeColor" style="margin-right: 10px" @click="openAddDialog"
        >添加评分</el-button
      >
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        accept=".xls, .xlsx"
        :on-change="uploadScoreFile"
      >
        <el-button :icon="FolderAdd" :color="themeColor">批量添加</el-button>
      </el-upload>
    </div>
    <BasicTable :table-option="createScoreTable">
      <template #totalScore="scope">
        <span>{{
          scope.currentCellData.row.hygiene_score +
          scope.currentCellData.row.tidy_score +
          scope.currentCellData.row.safety_score +
          scope.currentCellData.row.behavior_score
        }}</span>
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
    v-model="isOpenScoreDialog"
    :title="scoreForm.id === 0 ? '添加评分' : '编辑评分'"
    width="450px"
  >
    <BasicForm :form-option="createScoreForm"></BasicForm>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, watch, computed, reactive } from "vue";
  import { themeColor } from "$styleVariable";
  import { getScore, addScore, addScores, deleteScore, updateScore } from "@/api/score";
  import { getOption } from "@/api/common";
  import { BasicTable } from "@/components/Table";
  import { BasicForm } from "@/components/Form";
  import { Delete, Edit, FolderAdd } from "@element-plus/icons-vue";
  import { ElMessageBox, ElMessage, type UploadFile } from "element-plus";
  import * as xlsx from "xlsx/xlsx.mjs";

  // LifeCycle
  onBeforeMount(() => {
    let date = new Date();
    year.value = date.getFullYear();
    month.value = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    getScoreList();
  });

  // Data
  const year = ref();
  const month = ref();
  const selectMonth = ref();
  const scoreList = ref([]); // 评分列表
  const loading = ref(); // 表格加载
  const total = ref(0); // 分页器总条数
  let pageSize = ref(5); // 每页条数
  let page = ref(1); // 当前页
  const scoreForm = ref({
    id: 0,
    dorm_build: "",
    dorm_number: "",
    hygiene_score: "",
    tidy_score: "",
    safety_score: "",
    behavior_score: "",
    score_month: "",
  });
  const scoreFormRef = ref();
  const isOpenScoreDialog = ref(false);
  const selectOptions = reactive({
    dorm_build: [],
    dorm_number: [],
  });

  // Methods
  /* 获取选择月份评分情况 */
  const getScoreList = async () => {
    const currentMonth = year.value + "-" + month.value;
    let result = await getScore({
      score_month: currentMonth,
      page: page.value,
      pageSize: pageSize.value,
    });
    scoreList.value = result.scoreInfo;
    total.value = result.total;
  };

  /* 查询其他月份评分情况 */
  const changeMonth = () => {
    year.value = selectMonth.value.getFullYear();
    month.value =
      selectMonth.value.getMonth() < 9
        ? "0" + (selectMonth.value.getMonth() + 1)
        : selectMonth.value.getMonth() + 1;
    getScoreList();
  };

  const uploadScoreFile = (file: UploadFile) => {
    if (!file) return false;
    if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
      ElMessage({
        showClose: true,
        type: "error",
        message: "文件上传格式错误，请上传xls或xlsx格式文件",
      });
    }
    let fileMonth = "";
    if (/\d{4}年\d{1,2}月/.exec(file.name)) {
      const testMonth = /\d{4}年\d{1,2}月/.exec(file.name)[0];
      const middleMonth = testMonth.replace("年", "-").replace("月", "");
      const changeFormat = middleMonth.split("-");
      if (changeFormat[1].includes("0") || Number(changeFormat[1]) >= 10) {
        fileMonth = middleMonth;
      } else {
        fileMonth = changeFormat[0] + "-" + "0" + changeFormat[1];
      }
    } else {
      fileMonth = year.value + "-" + month.value;
    }
    const fileReader = new FileReader();
    fileReader.onload = async (evt) => {
      try {
        const uploadData = [];
        const data = evt.target?.result;
        const tableData = xlsx.read(data, {
          type: "binary",
        });
        const tableName = tableData.SheetNames[0];
        // 取第一张表
        const tableDataList = xlsx.utils.sheet_to_json(tableData.Sheets[tableName]);
        // 将数据重新压入
        for (let i = 0; i < tableDataList.length; i++) {
          const sheetData = {
            dorm_build: tableDataList[i]["楼栋"],
            dorm_number: tableDataList[i]["宿舍"],
            hygiene_score: tableDataList[i]["卫生分"],
            tidy_score: tableDataList[i]["整洁分"],
            safety_score: tableDataList[i]["安全分"],
            behavior_score: tableDataList[i]["行为分"],
            score_month: fileMonth,
          };
          uploadData.push(sheetData);
        }
        await addScores({ uploadData });
        getScoreList();
      } catch (error) {
        return false;
      }
    };
    fileReader.readAsBinaryString(file.raw);
  };

  const openAddDialog = () => {
    scoreForm.value.id = 0;
    scoreForm.value.dorm_build = "";
    scoreForm.value.dorm_number = "";
    scoreForm.value.hygiene_score = "";
    scoreForm.value.tidy_score = "";
    scoreForm.value.safety_score = "";
    scoreForm.value.behavior_score = "";
    scoreForm.value.score_month = "";
    isOpenScoreDialog.value = true;
  };

  // Watch
  watch(
    page,
    () => {
      getScoreList();
    },
    {
      deep: true,
    },
  );
  watch(
    pageSize,
    () => {
      getScoreList();
    },
    {
      deep: true,
    },
  );

  // RenderData
  const scoreTableData = [
    {
      prop: "dorm_build",
      title: "楼栋",
    },
    {
      prop: "dorm_number",
      title: "宿舍",
    },
    {
      prop: "hygiene_score",
      title: "卫生分",
    },
    {
      prop: "tidy_score",
      title: "整洁分",
    },
    {
      prop: "safety_score",
      title: "安全分",
    },
    {
      prop: "behavior_score",
      title: "行为分",
    },
    {
      prop: "total_score",
      title: "总分",
    },
    {
      prop: "repair_status",
      title: "操作",
    },
  ];
  const scoreFormData = {
    dorm_build: {
      label: "楼栋",
      placeholder: "请选择楼栋",
    },
    dorm_number: {
      label: "宿舍号",
      placeholder: "请选择宿舍号",
    },
    hygiene_score: {
      label: "卫生分",
      placeholder: "请输入卫生分",
    },
    tidy_score: {
      label: "整洁分",
      placeholder: "请输入整洁分",
    },
    safety_score: {
      label: "安全分",
      placeholder: "请输入安全分",
    },
    behavior_score: {
      label: "行为分",
      placeholder: "请输入行为分",
    },
    score_month: {
      label: "评分月份",
      placeholder: "请选择评分月份",
    },
  };
  // 评分信息表格配置对象
  const createScoreTable = computed(() => {
    return {
      data: scoreList,
      loading: loading,
      attr: {
        border: true,
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: scoreTableData.map((item: any) => {
        if (item.title !== "操作") {
          if (item.prop !== "total_score") {
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
              defaultSlotName: "totalScore",
            };
          }
        } else {
          return {
            attr: {
              label: item.title,
              headerAlign: "center",
              align: "center",
              width: "200px",
            },
            defaultSlotConfig: ["Edit", "Delete"].map((child: string) => {
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
                      scoreForm.value.id = currentRowData.row.id;
                      scoreForm.value.dorm_build = currentRowData.row.dorm_build;
                      scoreForm.value.dorm_number = currentRowData.row.dorm_number;
                      scoreForm.value.hygiene_score = currentRowData.row.hygiene_score;
                      scoreForm.value.tidy_score = currentRowData.row.tidy_score;
                      scoreForm.value.safety_score = currentRowData.row.safety_score;
                      scoreForm.value.behavior_score = currentRowData.row.behavior_score;
                      scoreForm.value.score_month = currentRowData.row.score_month;
                      isOpenScoreDialog.value = true;
                    } else {
                      ElMessageBox.confirm("确定删除本条评分吗？", "提示", {
                        type: "error",
                        buttonSize: "default",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        callback: async (action: string) => {
                          if (action === "confirm") {
                            await deleteScore({ id: currentRowData.row.id });
                            getScoreList();
                          }
                        },
                      });
                    }
                  },
                },
              };
            }),
          };
        }
      }),
    };
  });
  const renderItemArr = (obj: any) => {
    let select = ["dorm_number", "dorm_build"];
    let itemArr: Array<T> = [[]];
    Object.keys(obj).forEach((key: string) => {
      if (key === "id") return;
      if (select.includes(key)) {
        itemArr[0].push({
          span: 24,
          attr: {
            prop: key,
            label: scoreFormData[key].label,
          },
          component: {
            comp: "el-select",
            attr: {
              size: "default",
              placeholder: scoreFormData[key].placeholder,
              clearable: true,
              style: {
                width: "100%",
              },
            },
            event: {
              visibleChange: async (val: boolean) => {
                if (key === "dorm_build" && selectOptions[key].length !== 0) return;
                if (val) {
                  let searchKey = key === "dorm_number" ? "repair_dorm" : key;
                  let selectKey = "";
                  if (key === "dorm_number") {
                    selectOptions.dorm_number = [];
                    selectKey = scoreForm.value.dorm_build;
                    if (selectKey === "") {
                      ElMessage.warning("请先选择宿舍楼");
                      return;
                    }
                  }
                  let result = await getOption({ key: searchKey, selectKey });
                  selectOptions[key] = result.selectOptions;
                }
              },
            },
            children: selectOptions[key].map((option: any) => {
              return {
                comp: "el-option",
                attr: {
                  label: key === "dorm_number" ? option.dorm_number : option.dorm_build_name,
                  value: key === "dorm_number" ? option.dorm_number : option.dorm_build_name,
                },
              };
            }),
          },
        });
      } else if (key === "score_month") {
        itemArr[0].push({
          span: 24,
          attr: {
            prop: key,
            label: scoreFormData[key]["label"],
          },
          component: {
            comp: "el-date-picker",
            attr: {
              type: "month",
              size: "default",
              "value-format": "YYYY-MM",
              placeholder: scoreFormData[key]["placeholder"],
              style: {
                width: "100%",
              },
            },
          },
        });
      } else {
        itemArr[0].push({
          span: 24,
          attr: {
            prop: key,
            label: scoreFormData[key]["label"],
          },
          component: {
            comp: "el-input",
            attr: {
              size: "default",
              placeholder: scoreFormData[key]["placeholder"],
            },
          },
        });
      }
    });
    return itemArr;
  };
  const createScoreForm = computed(() => {
    return {
      mode: scoreForm,
      ref: scoreFormRef,
      attr: {
        size: "default",
        rules: {
          dorm_number: [{ required: true, message: "请选择宿舍号", trigger: "blur" }],
          dorm_build: [{ required: true, message: "请选择楼栋", trigger: "blur" }],
          hygiene_score: [{ required: true, message: "请输入卫生分", trigger: "blur" }],
          tidy_score: [{ required: true, message: "请输入整洁分", trigger: "blur" }],
          safety_score: [{ required: true, message: "请输入安全分", trigger: "blur" }],
          behavior_score: [{ required: true, message: "请输入行为分", trigger: "blur" }],
          score_month: [{ required: true, message: "请选择月份", trigger: "blur" }],
        },
        hideRequiredAsterisk: true,
        labelWidth: "70px",
        labelPosition: "left",
      },
      itemArr: [
        ...renderItemArr(scoreForm.value),
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
                        isOpenScoreDialog.value = false;
                      } else {
                        scoreFormRef.value.validate(async (valid: boolean) => {
                          if (!valid) return;
                          if (scoreForm.value.id !== 0) {
                            await updateScore(scoreForm.value);
                          } else {
                            await addScore(scoreForm.value);
                          }
                          getScoreList();
                          isOpenScoreDialog.value = false;
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
  .title-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    span {
      font-size: 20px;
      font-weight: 700;
    }

    .item {
      margin-right: 10px;
    }
  }

  .el-pagination {
    margin: 15px 0 0;
    justify-content: center;
  }
</style>
