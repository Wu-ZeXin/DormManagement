<template>
  <el-row style="width: 100%">
    <el-col :span="authCodeForm.input?.span">
      <el-input
        v-model="authCodeForm.mode[authCodeForm.prop]"
        v-bind="authCodeForm.input?.attr"
        v-on="authCodeForm.input?.event || {}"
      ></el-input>
    </el-col>
    <el-col :span="authCodeForm.btn?.span">
      <el-button
        v-bind="authCodeForm.btn?.attr"
        v-on="authCodeForm.btn?.event || {}"
        @click="authCodeForm.btn?.event?.click || getCode"
        :color="themeColor"
      >
        <div v-html="authCodeForm.btn?.html"></div>
      </el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import { themeColor } from "$styleVariable";

  interface BtnType {
    span: string | number;
    attr?: Recordable;
    event?: Recordable;
    html?: string;
  }

  interface InputType {
    span: string | number;
    attr?: Recordable;
    event?: Recordable;
  }

  interface AuthCodeForm {
    mode: Recordable;
    prop: string;
    btn?: BtnType;
    input?: InputType;
  }

  defineProps<{ authCodeForm: AuthCodeForm }>();

  const getCode = function () {
    console.log(111);
  };
</script>

<style scoped lang="less">
  .getCode {
    font-size: 10px;
    padding: 8px 4px;
  }
</style>
