import type { AppRouteModule } from "@/router/types";
import { RootRoute, LoginRoute, ForgetPasswordRoute } from "./basic";

// import.meta.glob("xxx", { eager: true }) 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob("./modules/**/*.ts", { eager: true }) as Record<string, any>;
const routeModulesList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModulesList.push(...modList);
});

// 异步路由
export const asyncRoutes = [...routeModulesList];

export const basicRoutes = [
  RootRoute,
  LoginRoute,
  ForgetPasswordRoute,
]
