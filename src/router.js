import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export let constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/layout/Layout'),
    hidden: true,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/home/index')
      },
    ]
  },
  {
    path: '/datadisplay',
    component: () => import('@/views/layout/Layout'),
    // hidden: true,
    redirect:'/datadisplay/index',
    children: [
      {
        path: 'index',
        name: 'datadisplay',
        meta: { title: 'datadisplay', icon: 'pdf' },
        component: () => import('@/views/dataDisplay/index')
      },
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap,
  mode: 'history'
})

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: '/permission',
    component: () => import('@/views/layout/Layout'),
    name: '权限测试',
    meta: { roles: ['admin']},
    children: [
      {
        path:'roleList',
        component: () => import('@/views/system/roleList'),
        name: '用户管理',
        meta: { roles: ['admin'] , icon: 'bug' , title: 'roleList'}
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    name: 'Page404',
    hidden:true,
    meta: { title: '404', noCache: true }
  },
  { path: '*', redirect: '/404', hidden: true }
]
