import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取宿舍楼信息列表
export function getDormBuild(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/dorm_build/getDormBuild",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加宿舍楼信息
export function addDormBuild(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/dorm_build/addDormBuild",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改宿舍楼信息
export function updateDormBuild(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/dorm_build/updateDormBuild",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除宿舍楼信息
export function deleteDormBuild(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/dorm_build/deleteDormBuild",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}