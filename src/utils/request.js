import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import configJson from '@/config/config'

const service = axios.create({
  baseURL: 'http://scs-api-dev.xaxhl.net/index.php?s=', // url = base url + request url  测试
  // baseURL: 'http://scrm-api.xaxhl.net/index.php?s=', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
})


service.interceptors.request.use(
  config => {
    /**开始请求增加一条加载数 */
    store.dispatch('app/setLoading',"add")
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    /** 响应完成后减去一条加载数 */
    store.dispatch('app/setLoading',"end")

    const res = response.data
    /**
    * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
    * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
    */
    if (res.code && res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 1000 ) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/logout').then(() => {
                location.reload();// 为了重新实例化vue-router对象 避免bug
              });
            })
          }
        return Promise.reject('error');
      
    } else {
      return res
    }
  },
  error => {
    store.dispatch('app/setLoading',"clear")  //报错清楚加载
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
