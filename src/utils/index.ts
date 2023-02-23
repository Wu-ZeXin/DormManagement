import { isObject } from "./is";

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export const convertBase64 = (file: any) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    let imgResult: any;
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
};

export const deployRoute = (authorityArr, routeArr) => {
  let resultRoute = [];
  authorityArr.forEach((authority) => {
    let route = routeArr.find((route) => {
      return route.name === authority.authority_name;
    });
    if (authority.hasOwnProperty("children")) {
      route["children"] = deployRoute(
        authority["children"],
        route["children"]
      );
      resultRoute.push(route);
    } else {
      resultRoute.push(route);
    }
  });
  return resultRoute;
};