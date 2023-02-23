import type { AppRouteRecordRaw } from "@/router/types";

const userInfo: AppRouteRecordRaw = {
  path: "/",
  name: "UserInfoManage",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "用户信息管理",
  },
  children: [
    {
      path: "/employee-manage",
      name: "EmployeeManage",
      component: () => import("@/views/system/userInfoManage/employeeManage/EmployeeManage.vue"),
      meta: {
        title: "职工信息管理",
      },
    },
    {
      path: "/student-manage",
      name: "StudentManage",
      component: () => import("@/views/system/userInfoManage/studentManage/StudentManage.vue"),
      meta: {
        title: "学生信息管理",
      },
    }
  ]
};

export default userInfo;
