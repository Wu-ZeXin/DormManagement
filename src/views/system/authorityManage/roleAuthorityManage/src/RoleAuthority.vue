<template>
  <div>
    <div class="authority-list-header">
      <h1>{{ role }}角色权限列表</h1>
      <el-select
        v-model="role"
        placeholder="请选择角色"
        size="default"
        clearable
        @visible-change="getRoleOptions"
        @change="getRoleAuthorityList"
      >
        <el-option
          v-for="item in roleSelectOptions"
          :key="item.role_id"
          :label="item.role_name"
          :value="item.role_name"
        >
        </el-option>
      </el-select>
    </div>
    <el-tree
      ref="treeRef"
      :data="authorityList"
      show-checkbox
      node-key="authority_id"
      :props="{
        label: 'authority_title',
      }"
      :default-checked-keys="defaultCheck"
      @check="changeRoleAuthority"
    >
      <template #default="{ data }">
        <span>
          <span>{{ data.authority_title }} —— </span>
          <span>
            <el-tag v-if="data.authority_type === 0" type="success">路由权限</el-tag>
            <el-tag v-else type="danger">操作权限</el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
  import { type Ref, ref, onBeforeMount } from "vue";
  import { getOption } from "@/api/common";
  import {
    getAuthorityList,
    getRoleAuthority,
    addRoleAuthority,
    deleteRoleAuthority,
  } from "@/api/authority";
  import { ElMessage } from "element-plus";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  interface RoleOptionType {
    role_id: number;
    role_name: string;
  }

  const reqAuthorityList = async () => {
    let result = await getAuthorityList();
    authorityList.value = result.authority;
  };
  const getRoleOptions = async (val: boolean) => {
    if (val && roleSelectOptions.value.length === 0) {
      let result = await getOption({ key: "role_authority" });
      roleSelectOptions.value = result.selectOptions;
    }
  };
  const getRoleAuthorityList = async (val: string) => {
    let item = roleSelectOptions.value.find((item) => {
      return item.role_name === val;
    });
    treeRef.value.getCheckedKeys().forEach((key: any) => {
      treeRef.value.setChecked(key, false);
    });
    if (typeof item !== "undefined") {
      const { role_id } = item;
      let result = await getRoleAuthority({ role: role_id });
      role_authority_id.value = result.authority;
      result.authority.forEach((key: any) => {
        let node = treeRef.value.getNode(key);
        if (node.childNodes.length) {
          let isAllCheck = node.childNodes.every((item: any) => {
            return role_authority_id.value.includes(item.data.authority_id);
          });
          isAllCheck && treeRef.value.setChecked(key, isAllCheck);
        } else {
          treeRef.value.setChecked(key, true);
        }
      });
    }
  };
  const changeRoleAuthority = async (data: Recordable) => {
    if (role.value === "") {
      treeRef.value.getCheckedKeys().forEach((key: any) => {
        treeRef.value.setChecked(key, false);
      });
      ElMessage.error("请先选择角色");
      return;
    }
    if (!userStore.getOperationAuthority.includes("UpdateRoleAuthority")) {
      ElMessage.error("无权限更改角色权限！");
      getRoleAuthorityList(role.value);
      return;
    }
    let item = roleSelectOptions.value.find((item) => {
      return item.role_name === role.value;
    });
    const { role_id } = item;
    if (role_authority_id.value.includes(data.authority_id)) {
      // 删除权限
      if (data.hasOwnProperty("children")) {
        let result = data["children"].every((item: any) => {
          return role_authority_id.value.includes(item.authority_id);
        });
        if (result) {
          await deleteRoleAuthority({ role_id, authority: data });
        } else {
          await addRoleAuthority({ role_id, authority: data });
        }
      } else {
        await deleteRoleAuthority({ role_id, authority: data });
      }
    } else {
      // 增加权限
      await addRoleAuthority({ role_id, authority: data });
    }
    let result = await getRoleAuthority({ role: role_id });
    role_authority_id.value = result.authority;
  };

  onBeforeMount(() => {
    reqAuthorityList();
  });

  const authorityList = ref([]);
  const treeRef = ref();
  const role = ref("");
  const role_authority_id = ref([]);
  const defaultCheck = ref([]);
  const roleSelectOptions: Ref<Array<RoleOptionType>> = ref([]);
  const userStore = useUserStoreWithOut();
</script>

<style scoped lang="less">
  .authority-list-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 25px;
      font-weight: 700;
      margin-right: 20px;
    }
  }
</style>
