export default [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: () => import ("@/pages/login")
  },

  {
    path: '/home',
    component: () => import ('@/components/home'),
    redirect: '/home/welcome',
    children: [
      { path: 'welcome', component: () => import ('@/pages/welcome') },
      { path: 'xgmm', component: () => import ("@/pages/personalCenter/PersonalInfo") },
      { path: 'newly', component: () => import ('@/pages/flatManage/flatList') },
      { path: 'sslb', component: () => import ('@/pages/dormManage/dormList') },
      { path: 'yhlb', component: () => import('@/pages/userRightsManage/userRightsList') },
      { path: 'xslb', component: () => import('@/pages/studentManage/studentList') },
      { path: 'shbx', component: () => import('@/pages/LogisticsService/damageRepair') },
      { path: 'bxlb', component: () => import('@/pages/LogisticsService/repairList') },
      { path: 'jdf', component: () => import('@/pages/lifeService/electricityRecharge') },
      { path: 'xyw', component: () => import('@/pages/lifeService/networkRecharge') },
      { path: 'xyykt', component: () => import('@/pages/lifeService/campusCard') },
      { path: 'sspf', component: () => import('@/pages/statsCentral/dormitoryScore') },
      { path: 'bxtj', component: () => import('@/pages/statsCentral/reportStatistics') },
      { path: 'lgdf', component: () => import('@/pages/statsCentral/buildTubeEvaluat') },
    ]
  },

]