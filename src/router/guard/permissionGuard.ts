import type { Router } from "vue-router";
import { getToken } from "@/utils/token";
import { WHITE_NAME_LIST } from "@/router";
import { PageEnum } from "@/enums/pageEnum";

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    let token = getToken();
    if (token) {
      // 用户登录
      if (to.path == PageEnum.BASE_LOGIN) {
        if (from.path === PageEnum.BASE_LOGIN || PageEnum.ROOT) {
          next(PageEnum.BASE_HOME);
        } else {
          next(from.path);
        }
      } else {
        next();
      }
    } else {
      // 用户未登录
      if (WHITE_NAME_LIST.includes(to.name as string)) {
        next();
      } else {
        next("/login?redirect=" + to.path);
      }
    }
  });
}
