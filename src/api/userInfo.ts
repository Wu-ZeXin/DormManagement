import { defHttp } from "@/packages/axios";

import type { ErrorMessageMode, SuccessMessageMode } from "#/axios";

// 获取职工信息
export function getEmployeeDataList(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/userInfo/getEmployee",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 更新职工信息
export function updateEmployee(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/userInfo/updateEmployee",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加职工信息
export function addEmployee(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/userInfo/addEmployee",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除职工信息
export function deleteEmployee(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/userInfo/deleteEmployee",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 获取学生信息
export function getStudentDataList(params = {}, mode: SuccessMessageMode = "none") {
  return defHttp.get(
    {
      url: "/userInfo/getStudent",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 删除学生信息
export function deleteStudent(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.delete(
    {
      url: "/userInfo/deleteStudent",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 修改学生信息
export function updateStudent(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.put(
    {
      url: "/userInfo/updateStudent",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}

// 添加学生信息
export function addStudent(params = {}, mode: SuccessMessageMode = "message") {
  return defHttp.post(
    {
      url: "/userInfo/addStudent",
      params,
    },
    {
      successMessageMode: mode,
    },
  );
}