import type { AppRouteRecordRaw } from "@/router/types";

const authority: AppRouteRecordRaw = {
  path: "/",
  name: "DormManage",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "宿舍管理",
  },
  children: [
    {
      path: "/build-manage",
      name: "BuildManage",
      component: () => import("@/views/system/dormManage/buildManage/BuildManage.vue"),
      meta: {
        title: "宿舍楼管理",
      },
    },
    {
      path: "/room-Manage",
      name: "RoomManage",
      component: () => import("@/views/system/dormManage/roomManage/RoomManage.vue"),
      meta: {
        title: "宿舍房间管理",
      },
    },
  ]
};

export default authority;
