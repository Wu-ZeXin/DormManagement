import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";
// 登录
export function login(params = {}, mode: ErrorMessageMode = "modal") {
  return defHttp.post(
    {
      url: "/user/login",
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
// 更新用户头像
export function modifyPortrait(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/user/modifyPortrait",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}
// 获取用户信息
export function getUserInfo(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/user/userInfo",
    },
    {
      successMessageMode: mode,
    },
  );
}
// 更新用户信息
export function updateUserInfo(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/user/updateUserInfo",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}
// 修改用户登陆密码
export function modifyPassword(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/user/modifyPassword",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}
// 退出
export function logout(params = {}, mode: ErrorMessageMode = "modal") {
  return defHttp.post(
    {
      url: "/user/logout",
    },
    {
      errorMessageMode: mode,
    },
  );
}
