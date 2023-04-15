import type { AppRouteRecordRaw } from "@/router/types";

const score: AppRouteRecordRaw = {
  path: "/",
  name: "DormScore",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "宿舍评分",
  },
  children: [
    {
      path: "/score-statistics",
      name: "ScoreStatistics",
      component: () => import("@/views/system/dormScore/scoreStatistics/ScoreStatistics.vue"),
      meta: {
        title: "评分统计",
      },
    },
    {
      path: "/score-enter",
      name: "ScoreEnter",
      component: () => import("@/views/system/dormScore/scoreEnter/ScoreEnter.vue"),
      meta: {
        title: "评分录入",
      },
    },
  ]
};

export default score;
