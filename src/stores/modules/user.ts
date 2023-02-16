import { getToken, setToken, removeToken } from "@/utils/token";
import { defineStore } from "pinia";
import md5 from "js-md5";

import { login, modifyPassword } from "@/api/user";
import { router } from "@/router";
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
  }),

  getters: {
    getPortrait(): string {
      return this.portrait;
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
      return res;
    },
    // 获取用户头像
    async reqPortrait() {
      this.portrait = sessionStorage.getItem("portrait") as string;
    },
    //  修改密码
    async reqModifyPassword(params: ModifyPasswordParams) {
      console.log(params);
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
