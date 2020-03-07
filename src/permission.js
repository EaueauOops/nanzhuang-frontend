import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetInfo').then(res => {
          let roles = []
          roles.push(res.data.role)
          // console.log(roles);
          store.dispatch('GenerateRoutes',{ roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({...to, replace: true })
          })
        }).catch(err =>{
          console.log(err);
          console.log("走到这里");
        });
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // console.log('next()');
      next()
    } else {
      // console.log('elsenextlogin');
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
