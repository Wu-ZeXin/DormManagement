import { getToken, setToken, removeToken } from "@/utils/token";
import { defineStore } from "pinia";
import md5 from "js-md5";

import { login, modifyPassword } from "@/api/user";
import { getUserAuthority } from "@/api/authority";
import { asyncRoutes } from "@/router/routes";
import { deployRoute } from "@/utils";
import { router, resetRouter } from "@/router";
import { store } from "@/stores";

interface LoginParams {
  userMark: string;
  password: string;
  userRole: string;
}

interface ModifyPasswordParams {
  password: string | undefined;
  confirmPassword: string | undefined;
}

export const useUserStore = defineStore({
  id: "user-store",

  state: () => ({
    portrait: "",
    token: getToken(),
    route_authority: [],
    operation_authority: [],
  }),

  getters: {
    getPortrait(): string {
      return this.portrait;
    },
    getRouteAuthority(): Array<T> {
      return this.route_authority;
    },
    getOperationAuthority(): Array<T> {
      return this.operation_authority;
    },
  },

  actions: {
    setPortrait(portrait: any) {
      sessionStorage.setItem("portrait", portrait);
      this.portrait = portrait;
    },
    // 登录
    async Login(params: LoginParams) {
      const res = await login({
        userMark: params.userMark,
        password: md5(params.password as string),
        userRole: params.userRole,
      });
      setToken(res.token);
      sessionStorage.setItem("portrait", res.userInfo.portrait);
      this.token = res.token;
      await this.GetUserAuthority();
      return res;
    },
    async GetUserAuthority() {
      let result = await getUserAuthority();
      this.route_authority = result.route_authority;
      this.operation_authority = result.operation_authority;
      deployRoute(this.route_authority, asyncRoutes).forEach((item: any) => {
        router.addRoute(item);
        router.options.routes.push(item);
      });
    },
    // 获取用户头像
    async reqPortrait() {
      this.portrait = sessionStorage.getItem("portrait") as string;
    },
    //  修改密码
    async reqModifyPassword(params: ModifyPasswordParams) {
      params.password = md5(params.password as string);
      params.confirmPassword = md5(params.confirmPassword as string);
      await modifyPassword(params);
    },
    // 退出
    async Logout(goLogin = false) {
      /* if (getToken()) {
        try {
          await logout();
        } catch {
          console.error("注销Token失败");
        }
      } */
      sessionStorage.clear();
      removeToken();
      resetRouter();
      goLogin &&
        router.push({
          name: "Login",
        });
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
