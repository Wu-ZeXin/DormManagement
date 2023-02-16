import type { AppRouteRecordRaw } from "@/router/types";

const home: AppRouteRecordRaw = {
  path: "/",
  name: "Home",
  redirect: "/welcome",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "主页",
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/system/welcome/Welcome.vue"),
      meta: {
        title: "主页",
      },
    },
    {
      path: "/personal-center",
      name: "PersonalCenter",
      component: () => import("@/views/system/personalCenter/PersonalCenter.vue"),
      meta: {
        title: "主页",
      },
    }
  ]
};

export default home;
