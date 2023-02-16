<script setup lang="ts">
  import { ElConfigProvider } from "element-plus";
  import { useLocale } from "@/locales/useLocale";

  const { getElLocale } = useLocale();
</script>

<template>
  <el-config-provider :locale="getElLocale">
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"></component>
      </transition>
    </RouterView>
  </el-config-provider>
</template>

<style scoped lang="less">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
