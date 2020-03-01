import { _get, _post } from '../apiMethods.js'

const system = {
  //登陆
  login(userName, password) {
    // console.log(userName);
    return _post('user/login', {
      userName,
      password
    })
  },
  //登出
  outLogin() {
    return _post('system/logout', {})
  },
  //获取用户菜单列表
  getMenus(operatorId, token) {
    return _post('system/getOperatorInfo', {
      operatorId,
      token
    })
  },
  add(data){
    return _post('system/add',data)
  }
}

export default system
