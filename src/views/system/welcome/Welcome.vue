<template>
  <el-card style="height: 100%">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="" />
      <span>Dormitory Management</span>
    </div>
    <Swiper :swiper-option="welcomeCarousel"></Swiper>
    <span class="welcome-speech">欢迎你，使用宿舍管理系统</span>
  </el-card>
</template>

<script setup lang="ts">
  import { Swiper } from "@/components/Swiper";
  import { Pagination, EffectCoverflow, Navigation } from "swiper";
  import { reactive } from "vue";

  const images = Object.keys(import.meta.glob("./images/**/*.png", { eager: true })).map(
    (item: string) => {
      return import.meta.glob("./images/**/*.png", { eager: true })[item]?.default;
    },
  );

  const welcomeCarousel = reactive({
    attr: {
      modules: [Pagination, Navigation, EffectCoverflow],
      pagination: true,
      navigation: true,
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: 2,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
    },
    swiperSlide: images.map((item: string) => {
      return {
        attr: {
          style: {
            width: "500px",
          },
        },
        swiperSlideDefault: {
          comp: "img",
          attr: {
            src: item,
            style: {
              width: "100%",
            },
          },
        },
      };
    }),
  });
</script>

<style scoped lang="less">
  :deep(.img-style) {
    width: 100px;
  }

  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 50px;

    img {
      width: 100px;
    }

    span {
      font-size: 30px;
      font-weight: 700;
      margin-left: 20px;
    }
  }

  .welcome-speech {
    display: block;
    font-size: 25px;
    font-weight: 700;
    text-align: center;
    margin-top: 30px;
  }
</style>
