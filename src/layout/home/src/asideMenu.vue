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
  import { ref, computed, onBeforeMount } from "vue";
  import { BasicMenu } from "@/components/Menu";
  import { Icon } from "@/components/Icon";
  import { themeColor } from "$styleVariable";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const isCollapse = ref(false);
  const menuOption = ref([
    {
      authority_id: 100,
      authority_pid: 0,
      authority_title: "用户信息管理",
      authority_name: "userInfoManage",
      authority_path: "/userInfo-manage",
      children: [
        {
          authority_id: 101,
          authority_pid: 0,
          authority_title: "职工信息管理",
          authority_name: "EmployeeManage",
          authority_path: "/employee-manage",
        },
        {
          authority_id: 102,
          authority_pid: 0,
          authority_title: "学生信息管理",
          authority_name: "StudentManage",
          authority_path: "/student-manage",
        },
      ],
    },
  ]);
  const icons = {
    userInfoManage: "User",
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
