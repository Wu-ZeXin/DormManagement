<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="home-logo">
        <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F17%2F15%2F59aec2f98aab1_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664179037&t=5a46a7494bf7393ad04095a41dfbbe85" alt="" />
        <span>宿舍管理系统</span>
      </div>
      <el-button type="warning" size="small" @click="quitHome" plain>退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边导航栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-tooltip effect="light" content="折叠/展开" placement="bottom-end">
          <div class="toggle-button" @click="changeCollapse">|||</div>
        </el-tooltip>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition='false'
          :default-active="activePath"
          router
        >
          <el-sub-menu v-for="(menuItem, index) in menuLists" :key="menuItem.id" :index="menuItem.id + ''">
            <template #title>
              <i :class="iconObj[menuItem.id]"></i>
              <span>{{ menuItem.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(item, index) in menuItem.children"
                :key="item.id"
                :index="'/home/' + item.path"
                @click="saveNavState('/home/'+ item.path)"
              >
                <el-icon>
                  <Menu />
                </el-icon>
                <span>{{ item.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Menu } from '@element-plus/icons-vue'

export default {
  name: "Home",

  data() {
    return {
      /* menuLists: [
        {
          id: 1,
          authName: "个人中心",
          path: "grzx",
          children: [
            { id: "1.1", authName: "个人信息", path: "xgmm", children: [] }
          ]
        },
        {
          id: 2,
          authName: "楼宇管理",
          path: "lygl",
          children: [
            { id: "2.1", authName: "楼宇列表", path: "newly", children: [] }
          ]
        },
        {
          id: 3,
          authName: "宿舍管理",
          path: "ssgl",
          children: [
            { id: "3.1", authName: "宿舍列表", path: "sslb", children: [] },
            { id: "3.2", authName: "宿舍文化建设", path: "sswhjs", children: [] },
          ]
        },
        {
          id: 4,
          authName: "用户权限管理",
          path: "yhqxgl",
          children: [
            { id: "4.1", authName: "用户列表", path: "yhlb", children: [] },
            { id: "4.2", authName: "角色列表", path: "jslb", children: [] },
            { id: "4.3", authName: "权限列表", path: "qxlb", children: [] },
          ]
        },
        {
          id: 5,
          authName: "学生管理",
          path: "xsgl",
          children: [
            { id: "5.1", authName: "学生列表", path: "xslb", children: [] }
          ]
        },
        {
          id: 6,
          authName: "后勤服务",
          path: "hqfw",
          children: [
            { id: "6.1", authName: "损坏报修", path: "shbx", children: [] },
            { id: "6.2", authName: "报修列表", path: "bxlb", children: [] }
          ]
        },
        {
          id: 7,
          authName: "生活服务",
          path: "shfw",
          children: [
            { id: "7.1", authName: "电费充值", path: "jdf", children: [] },
            { id: "7.2", authName: "校园网充值", path: "xyw", children: [] },
            { id: "7.3", authName: "校园一卡通", path: "xyykt", children: [] }
          ]
        },
        {
          id: 8,
          authName: "统计中心",
          path: "tjzx",
          children: [
            { id: "8.1", authName: "宿舍评分", path: "sspf", children: [] },
            { id: "8.2", authName: "报修统计", path: "bxtj", children: [] },
            { id: "8.3", authName: "楼管评价", path: "lgdf", children: [] }
          ]
        }
      ], */
      // 菜单列表
      menuLists: [],
      // 菜单选项对应的图标
      iconObj: {
        "1": "iconfont iconren",
        "2": "iconfont iconicon-",
        "3": "iconfont iconsushe",
        "4": "iconfont iconic_opt_feature",
        "5": "iconfont iconxuesheng",
        "6": "iconfont iconhouqinwuzi",
        "7": "iconfont iconiconfontshenghuojiaofei",
        "8": "iconfont icontongji"
      },
      // 判断是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },

  created() {
    this.activePath = sessionStorage.getItem('activePath')
    // 获取菜单列表
    this.menuLists = this.$store.state.login.routeLists
  },

  components: {
    Menu
  },

  methods: {
    quitHome() {
      sessionStorage.clear()
      this.$router.push('/login')
    },

    // 更改折叠状态
    changeCollapse() {
      this.isCollapse = !this.isCollapse
    },

    // 保存激活的链接
    saveNavState(activePath) {
      sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
};
</script>

<style lang="scss">
.home-container {
  height: 100%;

  .el-header {
    background-color: #23262e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;

    .home-logo {
      display: flex;
      align-items: center;

      img {
        width: 60px;
      }

      span {
        color: #fff;
        font-size: 20px;
        padding-left: 20px;
      }
    }
  }

  .el-container {
    .el-aside {
      background-color: #393d49;

      .toggle-button {
        background: #4a5064;
        color: white;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
        font-size: 10px;
        line-height: 24px;
      }

      .el-menu {
        border-right: none;

        .iconfont {
          padding-right: 15px;
        }
      }
    }

    .el-main {
      background-color: #EAEDF1;
    }
  }


}

.el-menu-item-group__title {
    display: none;
}
</style>