<template>
  <el-row :gutter="20" style="height: 100%;">
    <el-col :span="12">
      <el-card style="height: 100%;"><RoleManage/></el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="height: 100%;"><RoleAuthority/></el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import RoleAuthority from "@/views/system/authorityManage/roleAuthorityManage/src/RoleAuthority.vue";
  import RoleManage from "@/views/system/authorityManage/roleAuthorityManage/src/RoleManage.vue";
</script>

<style scoped lang="less"></style>
