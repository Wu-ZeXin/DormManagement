<template>
  <div class="authority-list-header">
    <h1>{{ userRole === "employee" ? "职工" : "学生" }}权限列表</h1>
    <el-input
      v-model="usermark"
      :placeholder="userRole === 'employee' ? '请输入职工号' : '请输入学生学号'"
      style="width: 250px"
      clearable
      @change="getUserAuthorityList"
    ></el-input>
    <el-button :color="themeColor" icon="Search" @click="getUserAuthorityList"></el-button>
  </div>
  <el-tree
    ref="treeRef"
    :data="authorityList"
    show-checkbox
    node-key="authority_id"
    :props="{
      label: 'authority_title',
    }"
    default-expand-all
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
</template>

<script setup lang="ts">
  import { ref, onBeforeMount } from "vue";
  import { themeColor } from "$styleVariable";
  import { getAuthorityList, getUserAuthorityID, addUserAuthority, deleteUserAuthority } from "@/api/authority";
  import { ElMessage } from "element-plus";
  import { useUserStoreWithOut } from "@/stores/modules/user";

  const props = defineProps({
    userRole: String,
  });

  const reqAuthorityList = async () => {
    let result = await getAuthorityList();
    authorityList.value = result.authority;
  };

  const getUserAuthorityList = async () => {
    treeRef.value.getCheckedKeys().forEach((key: any) => {
      treeRef.value.setChecked(key, false);
    });
    if (usermark.value === "") return;
    let result = await getUserAuthorityID({ key: props.userRole, usermark: usermark.value });
    user_authority_id.value = result.user_authority_id;
    result.user_authority_id.forEach((key: any) => {
      let node = treeRef.value.getNode(key);
      if (node.childNodes.length) {
        let isAllCheck = node.childNodes.every((item: any) => {
          return user_authority_id.value.includes(item.data.authority_id);
        });
        isAllCheck && treeRef.value.setChecked(key, isAllCheck);
      } else {
        treeRef.value.setChecked(key, true);
      }
    });
  };

  const changeRoleAuthority = async (data: Recordable) => {
    if (usermark.value === "") {
      treeRef.value.getCheckedKeys().forEach((key: any) => {
        treeRef.value.setChecked(key, false);
      });
      ElMessage.error(props.userRole === "employee" ? "请先输入职工号" : "请先输入学生学号");
      return;
    }
    if (props.userRole === "employee") {
      if (!userStore.getOperationAuthority.includes("UpdateEmployeeAuthority")) {
        ElMessage.error("无权限更改职工权限！");
        getUserAuthorityList();
        return;
      }
    } else if(props.userRole === "student") {
      if (!userStore.getOperationAuthority.includes("UpdateStudentAuthority")) {
        ElMessage.error("无权限更改学生权限！");
        getUserAuthorityList();
        return;
      }
    }
    if (user_authority_id.value.includes(data.authority_id)) {
      // 删除权限
      if (data.hasOwnProperty("children")) {
        let result = data["children"].every((item: any) => {
          return user_authority_id.value.includes(item.authority_id);
        });
        if (result) {
          await deleteUserAuthority({ key: props.userRole, usermark: usermark.value, authority: data });
        } else {
          await addUserAuthority({ key: props.userRole, usermark: usermark.value, authority: data });
        }
      } else {
        await deleteUserAuthority({ key: props.userRole, usermark: usermark.value, authority: data });
      }
    } else {
      // 增加权限
      await addUserAuthority({ key: props.userRole, usermark: usermark.value, authority: data });
    }
    let result = await getUserAuthorityID({ key: props.userRole, usermark: usermark.value });
    user_authority_id.value = result.user_authority_id;
  };

  onBeforeMount(() => {
    reqAuthorityList();
  });

  const authorityList = ref([]);
  const treeRef = ref();
  const usermark = ref("");
  const user_authority_id = ref([]);
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
