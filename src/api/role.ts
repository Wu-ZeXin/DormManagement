import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取角色列表
export function getRole(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/role/getRole",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加角色列表
export function addRole(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/role/addRole",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改角色列表
export function updateRole(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/role/updateRole",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除角色列表
export function deleteRole(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/role/deleteRole",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}