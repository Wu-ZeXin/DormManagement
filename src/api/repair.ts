import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取报修列表
export function getRepairBill(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/repair/getRepairBillList",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加报修单
export function addRepairBill(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/repair/addRepairBill",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改报修单
export function updateRepairBill(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/repair/updateRepairBill",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改报修单状态
export function updateRepairBillStatus(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/repair/updateRepairBillStatus",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除报修单
export function deleteRepairBill(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/repair/deleteRepairBill",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}