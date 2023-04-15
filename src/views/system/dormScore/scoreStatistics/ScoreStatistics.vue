<template>
  <el-card class="score-data">
    <div class="score-title-container">
      <span class="score-title">{{ year }}年{{ month }}月文明宿舍评分统计</span>
      <el-date-picker
        class="month-select"
        v-model="selectMonth"
        type="month"
        size="small"
        :clearable="false"
        placeholder="请选择查看月份"
        @change="changeMonth"
      />
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
  </el-card>
  <div class="map-data-container">
    <el-card class="score-map-data">
      <div ref="scorePieChart" style="height: 100%"></div>
    </el-card>
    <el-card class="score-map-data">
      <div ref="scoreBarChart" style="height: 100%"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onBeforeMount, computed, watch, type Ref } from "vue";
  import { BasicTable } from "@/components/Table";
  import { getScore } from "@/api/score";
  import * as echarts from "echarts";

  onBeforeMount(async () => {
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
  const dorm_build = [
    "北苑1栋",
    "北苑2栋",
    "南苑1栋A",
    "南苑1栋B",
    "南苑1栋C",
    "南苑2栋A",
    "南苑2栋B",
    "南苑2栋C",
    "南苑3栋A",
    "南苑3栋B",
    "南苑4栋A",
    "南苑4栋B",
    "南苑5栋A",
    "南苑5栋B",
    "南苑5栋C",
    "南苑6栋A",
    "南苑6栋B",
    "南苑7栋A",
    "南苑7栋B",
    "南苑8栋A",
    "南苑8栋B",
    "南苑9栋",
    "中苑1栋A",
    "中苑1栋B",
    "中苑1栋C",
    "中苑2栋",
    "中苑3栋A",
    "中苑3栋B",
    "中苑4栋",
    "中苑5栋",
    "中苑6栋",
    "中苑7栋",
    "中苑8栋",
    "中苑9栋",
    "中苑10栋A",
    "中苑10栋B",
    "中苑10栋C",
    "中苑11栋A",
    "中苑11栋B",
    "中苑12栋A",
    "中苑12栋B",
    "中苑12栋C",
    "中苑13栋A",
    "中苑13栋B",
  ];
  const civilizedDormQuantity = ref([]);
  const fractionsNumber: Ref<Array<T>> = ref([]);
  const scoreBarChart = ref();
  const scorePieChart = ref();

  // Watch
  watch(scoreList, () => {
    setTimeout(() => {
      drawScorePieChart();
      drawScoreBarChart();
    }, 50);
    {
      deep: true;
    }
  });

  // Methods
  /* 获取选择月份评分情况 */
  const getScoreList = async () => {
    const currentMonth = year.value + "-" + month.value;
    let result = await getScore({
      score_month: currentMonth,
    });
    scoreList.value = result.scoreInfo;
    civilizedDormQuantity.value = [];
    dorm_build.forEach((dormBuild: string) => {
      let i = 0;
      result.scoreInfo.forEach((item: Recordable) => {
        if (item.dorm_build === dormBuild) {
          i++;
        }
      });
      civilizedDormQuantity.value.push(i);
    });
    let between60To69 = 0;
    let between70To79 = 0;
    let between80To89 = 0;
    let between90To100 = 0;
    result.scoreInfo.forEach((item: Recordable) => {
      let totalScore =
        item.hygiene_score + item.tidy_score + item.safety_score + item.behavior_score;
      switch (true) {
        case totalScore >= 60 && totalScore < 70:
          console.log(totalScore);
          between60To69++;
          break;
        case totalScore >= 70 && totalScore < 80:
          between70To79++;
          break;
        case totalScore >= 80 && totalScore < 90:
          between80To89++;
          break;
        case totalScore >= 90 && totalScore <= 100:
          between90To100++;
          break;
      }
    });
    fractionsNumber.value = [
      { value: between60To69, name: "60~69" },
      { value: between70To79, name: "70~79" },
      { value: between80To89, name: "80~89" },
      { value: between90To100, name: "90~100" },
    ];
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

  // 绘评分圆饼图
  let pieChart: any;
  const drawScorePieChart = () => {
    if (pieChart != null && pieChart != undefined && pieChart != "") {
      pieChart.dispose();
    }
    pieChart = echarts.init(scorePieChart.value);
    pieChart.setOption({
      title: {
        text: "各分数段数量及比例",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Quantity",
          type: "pie",
          radius: "50%",
          top: "10%",
          data: fractionsNumber.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  };

  // 绘评分柱状图
  let barChart: any;
  const drawScoreBarChart = () => {
    if (barChart != null && barChart != undefined && barChart != "") {
      barChart.dispose();
    }
    barChart = echarts.init(scoreBarChart.value);
    barChart.setOption({
      title: {
        text: "各楼栋文明宿舍数量",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      color: ["#007D8C"],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: dorm_build,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: { interval: 0, rotate: 260 },
        },
      ],
      yAxis: [
        {
          type: "value",
          minInterval : 1,
          boundaryGap : [ 0, 0.1 ]
        },
      ],
      series: [
        {
          name: "Quantity",
          type: "bar",
          data: civilizedDormQuantity.value,
        },
      ],
    });
  };

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
  ];
  // 评分信息表格配置对象
  const createScoreTable = computed(() => {
    return {
      data: scoreList,
      loading: loading,
      attr: {
        height: "220px",
        size: "default",
        highlightCurrentRow: true,
      },
      columnArr: scoreTableData.map((item: any) => {
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
      }),
    };
  });
</script>

<style scoped lang="less">
  :deep(.month-select) {
    position: absolute;
    right: 0;
    top: 15%;
  }

  .score-data {
    height: 50%;
    margin-bottom: 10px;

    .score-title-container {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      .score-title {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }

  .map-data-container {
    display: flex;
    height: 48%;

    .score-map-data {
      width: 59.5%;
      height: 100%;
      padding: 10px 10px 0;

      :deep(.el-card__body) {
        height: 100%;
        padding: 0 !important;
      }

      &:first-child {
        width: 40%;
        margin-right: 10px;
        padding: 10px 10px 0;
      }
    }
  }
</style>
