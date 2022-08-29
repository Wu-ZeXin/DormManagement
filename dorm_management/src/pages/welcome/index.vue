<template>
  <div>
    <el-card>
      <!-- 顶部logo -->
      <div class="logo">
        <img src="https://img2.baidu.com/it/u=3831548329,666745111&fm=253&fmt=auto&app=138&f=JPEG?w=538&h=500" alt="">
        <h1>Dormitory management</h1>
      </div>
      <!-- 轮播图 -->
      <el-carousel :interval="2000" type="card" height="300px">
        <el-carousel-item v-for="(item, index) in imageLists" :key="index">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
      <!-- 底部欢迎语 -->
      <h1 class="welcome">欢迎你，使用宿舍管理系统</h1>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'Welcome',

  data() {
    return {
      imageLists: [
        require("@/assets/images/1.png"),
        require("@/assets/images/2.png"),
        require("@/assets/images/3.png"),
        require("@/assets/images/4.png"),
        require("@/assets/images/5.png"),
        require("@/assets/images/6.png"),
      ]
    }
  }
}
</script>

<style lang="scss">
  .el-card {
    .logo {
      display: flex;
      text-align: center;
      margin-bottom: 50px;
      img {
        width: 100px;
        background-color: #457A6A;
      }

      h1 {
        padding-left: 70px;
        line-height: 92.93px;
      }
    }

    .el-carousel {
      .el-carousel__item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .welcome {
      font-size: 25px;
      text-align: center;
      margin: 30px 0;
    }
  }
</style>