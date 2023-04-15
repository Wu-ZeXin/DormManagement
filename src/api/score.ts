import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取评分列表
export function getScore(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/score/getScore",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加评分
export function addScore(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/score/addScore",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 批量添加评分
export function addScores(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/score/addScores",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改评分
export function updateScore(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/score/updateScore",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除评分
export function deleteScore(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/score/deleteScore",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}