import type { AppRouteRecordRaw } from "@/router/types";

const common: AppRouteRecordRaw = {
  path: "/",
  name: "Common",
  redirect: "/welcome",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "常规路由",
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/system/welcome/Welcome.vue"),
      meta: {
        title: "欢迎",
      },
    },
    {
      path: "/personal-center",
      name: "PersonalCenter",
      component: () => import("@/views/system/personalCenter/PersonalCenter.vue"),
      meta: {
        title: "个人中心",
      },
    }
  ]
};

export default common;
