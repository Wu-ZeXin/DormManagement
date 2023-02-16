import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取职工的职工号和姓名做选项
export function getOption(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/common/getOption",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}