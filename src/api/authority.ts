import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取权限列表
export function getAuthorityList(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/authority/getAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加权限
export function addAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/authority/addAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改权限
export function updateAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/authority/updateAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除权限
export function deleteAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/authority/deleteAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 获取角色权限
export function getRoleAuthority(params = {}, mode: SuccessMessageMode = "none", errorMode: ErrorMessageMode = "none") {
  return defHttp.get(
    {
      url: "/authority/getRoleAuthority",
      params,
    },
    {
      successMessageMode: mode,
      errorMessageMode: errorMode
    },
  );
}

// 添加角色权限
export function addRoleAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/authority/addRoleAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除角色权限
export function deleteRoleAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/authority/deleteRoleAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 获取用户权限
export function getUserAuthority(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/authority/getUserAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 获取用户权限ID
export function getUserAuthorityID(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/authority/getUserAuthorityID",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加用户权限
export function addUserAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/authority/addUserAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除用户权限
export function deleteUserAuthority(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/authority/deleteUserAuthority",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}