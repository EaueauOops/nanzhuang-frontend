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
      // {
      //   path: '/401',
      //   component: () => import('@/views/errorPage/401'),
      //   hidden: true
      // }
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
    meta: { role: ['admin','user']},
    children: [
      {
        path:'roleLise',
        component: () => import('@/views/system/roleList'),
        name: '用户管理',
        meta: { role: ['admin']}
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    name: 'Page404',
    meta: { title: '404', noCache: true }
  },
  { path: '*', redirect: '/404', hidden: true }
]
