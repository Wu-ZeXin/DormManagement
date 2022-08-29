import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 引入仓库
import store from './store'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入字体图标
import '@/assets/font/iconfont.css'
// 引入全局样式表
import '@/assets/css/global.css'
// 引入xlsx——excel插件
import * as xlsx from 'xlsx'
// 引入echarts
import * as echarts from 'echarts';


const app = createApp(App)

// 引入elemen-plus图标
/* import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [iconName, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(iconName, component)
} */

app.use(router)
app.use(store)
app.use(ElementPlus)

// import axios from 'axios'
// 在vue3中设置全局属性，相当于vue2的 Vue.prototype.$http = axios
// app.config.globalProperties.$http = axios
// 设置ElMessage、ElNotification、ElMessageBox为全局变量
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$notify = ElNotification
app.config.globalProperties.$messageBox = ElMessageBox

// 设置xlsx为全局变量
app.config.globalProperties.$xlsx = xlsx
// 设置echarts为全局变量
app.config.globalProperties.$echarts = echarts

// 注册BreadCrumb为全局组件
import breadcrumb from '@/components/breadcrumb'
app.component("BreadCrumb", breadcrumb)

app.mount('#app')