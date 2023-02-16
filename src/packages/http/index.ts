import { getAppEnvConfig } from "@/utils/env";
import requestSetting from "@/settings/requestSetting";
import { defHttp } from "@/packages/axios";
import type { AxiosRequestConfig } from "axios";
import type { RequestOptions } from "#/axios";

const { VITE_USER_NODE_ENV } = getAppEnvConfig();
const { MockBaseUrl } = requestSetting;

class Http {
  constructor() {}

  get(
    isOnline: boolean,
    config: AxiosRequestConfig,
    options?: RequestOptions,
    MockData?: Recordable,
  ) {
    if (isOnline) {
      return defHttp.get(config, options);
    } else {
      if (typeof VITE_USER_NODE_ENV === "undefined") {
        return defHttp.get({ baseURL: MockBaseUrl, ...config }, options);
      } else {
        return MockData || {};
      }
    }
  }

  post(
    isOnline: boolean,
    config: AxiosRequestConfig,
    options?: RequestOptions,
    MockData?: Recordable,
  ) {
    if (isOnline) {
      return defHttp.post(config, options);
    } else {
      if (typeof VITE_USER_NODE_ENV === "undefined") {
        return defHttp.post({ baseURL: MockBaseUrl, ...config }, options);
      } else {
        return MockData || {};
      }
    }
  }

  put(
    isOnline: boolean,
    config: AxiosRequestConfig,
    options?: RequestOptions,
    MockData?: Recordable,
  ) {
    if (isOnline) {
      return defHttp.put(config, options);
    } else {
      if (typeof VITE_USER_NODE_ENV === "undefined") {
        return defHttp.put({ baseURL: MockBaseUrl, ...config }, options);
      } else {
        return MockData || {};
      }
    }
  }

  delete(
    isOnline: boolean,
    config: AxiosRequestConfig,
    options?: RequestOptions,
    MockData?: Recordable,
  ) {
    if (isOnline) {
      return defHttp.delete(config, options);
    } else {
      if (typeof VITE_USER_NODE_ENV === "undefined") {
        return defHttp.delete({ baseURL: MockBaseUrl, ...config }, options);
      } else {
        return MockData || {};
      }
    }
  }
}

function createRequest() {
  return new Http();
}

export const Request = createRequest();
