// import { login, outLogin, getInfo, getMenus } from '@/api'
import api from '@/api'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRouterMap, asyncRouterMap } from '@/router'
import axios from 'axios'
import {getInfo} from '../../api'

const { outLogin,login,getMenus } = api.system

function hasPermission(roles, route) {
  // console.log(roles);
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const user = {
  state: {
    token: '',
    info: {},
    avatar: '',
    routers: constantRouterMap,
    addRouters: [],
    roles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      sessionStorage.setItem('token', JSON.stringify(token))
    },
    SET_INFO: (state, data) => {
      state.info = data
      sessionStorage.setItem('info', JSON.stringify(data))
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      sessionStorage.setItem('addRouters', JSON.stringify(routers))
      // console.log(constantRouterMap)
      state.routers = constantRouterMap.concat(routers)
      sessionStorage.setItem('routers', JSON.stringify(state.routers))
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(res => {
          const data = res
          // console.log('user'+data.data.token)
          if (data.code == 0 && data.data.token) {
              commit('SET_TOKEN', data.data.token)
              // commit('SET_INFO', data.operatorInfo)
              commit('SET_INFO', data.data.userId)

            }
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    //获取管理员信息
    // GetoOperatorInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(res => {
    //       const data = res.operatorInfo
    //       commit('SET_INFO', data)
    //       resolve(data)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 获取用户信息
    GetInfo({ commit}) {
    // GetInfo({ commit } , state) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const data = res.data.role
            commit('SET_INFO', data)
            commit('SET_ROLES', data)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取菜单
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        console.log(roles);
        const accessedRouters = asyncRouterMap.filter(v => {
          if(roles.indexOf('admin') >= 0 ) return true
          if(hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if(hasPermission(roles, child)){
                  return child
                }
                return false
              })
              return v
            }
          }
          return false
        })
        commit('SET_ROUTERS',accessedRouters)
        resolve()
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_INFO', {})
        commit('SET_ROUTERS', [])
        sessionStorage.clear()
        // removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_INFO', {})
        commit('SET_ROUTERS', [])
        sessionStorage.clear()
        resolve()
      })
    }
  }
}

export default user
