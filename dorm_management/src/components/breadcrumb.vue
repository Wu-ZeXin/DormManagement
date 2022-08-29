<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ firstTitle }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ secondTitle }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { markRaw  } from "vue"
import { ArrowRight } from "@element-plus/icons-vue"

export default {
  name: 'BreadCrumb',

  data() {
    return {
      ArrowRight: markRaw(ArrowRight),
    }
  },

  props: ["firstTitle", 'secondTitle']
}
</script>

<style>
</style>