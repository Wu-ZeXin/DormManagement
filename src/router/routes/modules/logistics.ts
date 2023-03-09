import type { AppRouteRecordRaw } from "@/router/types";

const logistics: AppRouteRecordRaw = {
  path: "/",
  name: "LogisticsService",
  redirect: "/logistics-repair",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "后勤服务",
  },
  children: [
    {
      path: "/logistics-repair",
      name: "LogisticsRepair",
      component: () => import("@/views/system/logisticsService/logisticsRepair/LogisticsRepair.vue"),
      meta: {
        title: "后勤报修",
      },
    },
    {
      path: "/logistics-list",
      name: "LogisticsList",
      component: () => import("@/views/system/logisticsService/logisticsList/LogisticsList.vue"),
      meta: {
        title: "报修列表",
      },
    }
  ]
};

export default logistics;
