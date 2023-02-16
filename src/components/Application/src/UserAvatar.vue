<template>
  <div class="user-avatar-style">
    <Dropdown :dropdownOption="createDropdown"></Dropdown>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onBeforeMount } from "vue";
  import { Dropdown } from "@/components/Dropdown";
  import { useRouter } from "vue-router";
  import { useUserStoreWithOut } from "$stores/user";
  import { UserFilled } from "@element-plus/icons-vue";

  const router = useRouter();
  const userStore = useUserStoreWithOut();
  const portrait = ref("");

  onBeforeMount(async () => {
    await userStore.reqPortrait();
    portrait.value = userStore.getPortrait;
  });

  watch(
    () => userStore.portrait,
    () => {
      portrait.value = userStore.getPortrait;
    },
    { deep: true },
  );

  /**
   * 用户头像下拉菜单的菜单项数组
   * command——派发到command回调函数的指令参数/跳转路由
   * icon——菜单项的图标，必须是Svg图标
   * content——菜单项内容
   * @params [command, icon, content]
   */
  const dropdownItemArr = [
    ["PersonalCenter", "Avatar", "个人中心"],
    ["Logout", "logout", "退出登录"],
  ];

  /**
   * 生成用户头像下拉菜单的配置对象的菜单项数组
   */
  const dropdownItem = function (): Array<T> {
    return dropdownItemArr.map((item) => {
      return {
        attr: {
          command: item[0],
        },
        icon: {
          isSvgIcon: item[1] === "logout",
          name: item[1],
          style: {
            "margin-right": "6px",
          },
          size: 16,
        },
        content: item[2],
      };
    });
  };

  /**
   * 用户头像下拉菜单的配置对象
   */
  const createDropdown = computed(() => {
    return {
      event: {
        command: function (val: any) {
          if (val === "Logout") {
            userStore.Logout(true);
          } else {
            router.push({
              name: val,
            });
          }
        },
      },
      titleConfig: {
        comp: "el-avatar",
        attr: {
          icon: portrait.value === null ? UserFilled : "",
          src: portrait.value,
        },
      },
      itemArr: dropdownItem(),
    };
  });
</script>
