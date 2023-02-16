import type { AppRouteRecordRaw } from "../types";

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: "/login",
  meta: {
    title: "title",
  },
};

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
  path: "/login",
  name: "Login",
  component: () => import("@/views/common/Login.vue"),
  meta: {
    title: "登录",
  },
};

// 忘记密码路由
export const ForgetPasswordRoute: AppRouteRecordRaw = {
  path: "/forgetPassword",
  name: "ForgetPassword",
  component: () => import("@/views/common/ForgetPassword.vue"),
  meta: {
    title: "忘记密码",
  },
};
