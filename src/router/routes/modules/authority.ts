import type { AppRouteRecordRaw } from "@/router/types";

const authority: AppRouteRecordRaw = {
  path: "/",
  name: "AuthorityManage",
  component: () => import("@/layout/home/Home.vue"),
  meta: {
    title: "权限管理",
  },
  children: [
    {
      path: "/authority-list",
      name: "AuthorityList",
      component: () => import("@/views/system/authorityManage/authorityList/AuthorityList.vue"),
      meta: {
        title: "权限列表",
      },
    },
    {
      path: "/role-authority",
      name: "RoleAuthority",
      component: () => import("@/views/system/authorityManage/roleAuthorityManage/RoleAuthorityManage.vue"),
      meta: {
        title: "角色权限管理",
      },
    },
    {
      path: "/user-authority",
      name: "UserAuthority",
      component: () => import("@/views/system/authorityManage/userAuthorityManage/UserAuthorityManage.vue"),
      meta: {
        title: "用户权限管理",
      },
    },
  ]
};

export default authority;
