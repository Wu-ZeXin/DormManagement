<template>
  <el-aside :width="isCollapse ? '60px' : '200px'" class="aside">
    <div
      class="aside-header"
      :style="{
        flexDirection: isCollapse ? 'column' : 'row',
        margin: isCollapse ? '10px 0 0 0' : '10px 0',
      }"
    >
      <div class="logo-title">
        <img src="@/assets/images/logoWhite.png" alt="" />
        <h1 v-if="!isCollapse">DM</h1>
      </div>
      <Icon
        :isSvgIcon="false"
        :name="isCollapse ? 'Expand' : 'Fold'"
        :size="20"
        :style="{ margin: isCollapse ? '6px 0px' : '0px 0px', cursor: 'pointer' }"
        @click="collapse"
      ></Icon>
    </div>
    <BasicMenu :menuOption="createAsideMenu" class="menu-style"></BasicMenu>
  </el-aside>
</template>

<script setup lang="ts">
  import { type Ref, ref, computed, onBeforeMount } from "vue";
  import { BasicMenu } from "@/components/Menu";
  import { Icon } from "@/components/Icon";
  import { themeColor } from "$styleVariable";
  import { useRoute } from "vue-router";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  onBeforeMount(() => {
    menuOption.value = userStore.getRouteAuthority.filter((item: any) => {
      return item.authority_name !== "Common";
    });
  });

  const route = useRoute();
  const isCollapse = ref(false);
  const userStore = useUserStoreWithOut();
  const menuOption: Ref<Array<T>> = ref([]);
  const icons = {
    UserInfoManage: "User",
    AuthorityManage: "Setting",
    DormManage: "OfficeBuilding",
    LogisticsService: "Tools",
  };
  const renderItemArr = (item: any) => {
    if (item.hasOwnProperty("children")) {
      return {
        attr: {
          index: item.authority_path,
        },
        icon: {
          isSvgIcon: false,
          name: icons[item.authority_name],
        },
        text: item.authority_title,
        itemArr: item.children.map((child: any) => {
          return renderItemArr(child);
        }),
      };
    } else {
      return {
        attr: {
          index: item.authority_path,
        },
        icon: {
          isSvgIcon: false,
          name: icons[item.authority_name],
        },
        text: item.authority_title,
      };
    }
  };
  let createAsideMenu = computed(() => {
    return {
      attr: {
        uniqueOpened: true,
        backgroundColor: themeColor,
        textColor: "#FFF",
        activeTextColor: "#FFF",
        defaultActive: route.name,
        router: true,
        collapse: isCollapse.value,
      },
      itemArr: menuOption.value.map((item: any) => {
        return renderItemArr(item);
      }),
    };
  });

  const collapse = function () {
    isCollapse.value = !isCollapse.value;
  };
</script>

<style scoped lang="less">
  .aside {
    min-height: 100vh;
    transition: width 0.3s;
    background-color: @themeColor;
    border-right: 1px solid #fff;

    .aside-header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;

      .logo-title {
        display: flex;
        align-items: center;
        img {
          height: 45px;
        }

        h1 {
          font-size: 25px;
          margin-left: 6px;
        }
      }
    }
  }

  :deep(.el-menu-item.is-active) {
    background-color: #006470 !important;
  }

  .menu-style {
    border-right: none;
  }
</style>
