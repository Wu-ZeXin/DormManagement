import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取宿舍楼信息列表
export function getDorm(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/dorm/getDorm",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 获取宿舍人员信息
export function getDormStaff(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/dorm/getDormStaff",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加宿舍
export function addDorm(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/dorm/addDorm",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 换宿/申请宿舍
export function changeDorm(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/dorm/changeDorm",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 退宿
export function checkOut(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/dorm/checkOut",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}