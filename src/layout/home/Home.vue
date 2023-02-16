<template>
  <el-container class="container">
    <AsideMenu></AsideMenu>
    <el-container>
      <el-header class="header">
        <UserAvatar class="user-avatar"></UserAvatar>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import AsideMenu from "@/layout/home/src/asideMenu.vue";
  import { UserAvatar } from "@/components/Application";
</script>

<style scoped lang="less">
  :deep(.el-header) {
    display: flex;
    flex-direction: row-reverse;
    background-color: @themeColor;
  }

  .user-avatar {
    margin-top: 10px;
    margin-right: 20px;
  }
</style>
