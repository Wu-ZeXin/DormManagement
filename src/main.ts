import { createApp } from "vue";

import App from "@/App.vue";
import { router, setupRouter } from "@/router";
import { setupRouterGuard } from "@/router/guard"
import { setupStore } from "@/stores";
import { setupI18n } from "@/locales/setupI18n";

import "@/style/global.less";
import setupElementPlus from "@/packages/element-plus/el-import";
import setupDefineComponent from "@/packages/defineComponents";

async function bootstrap() {
  const app = createApp(App);

  // 多语言配置
  await setupI18n(app);
  // 配置状态仓库
  setupStore(app);
  // 配置路由
  setupRouter(app);
  // 路由守卫
  setupRouterGuard(router);
  // 按需加载Element-Plus组件及图标
  setupElementPlus(app);
  // 加载自定义组件
  setupDefineComponent(app);

  app.mount("#app");
}

bootstrap();
