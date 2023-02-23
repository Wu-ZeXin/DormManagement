<template>
  <el-row :gutter="20" style="height: 100%;">
    <el-col :span="12">
      <el-card style="height: 100%;"><UserAuthority :user-role="'employee'"/></el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="height: 100%;"><UserAuthority :user-role="'student'"/></el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import UserAuthority from './src/UserAuthority.vue';
</script>

<style scoped lang="less">

</style>
