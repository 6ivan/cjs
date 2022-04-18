import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken,setToken } from '@/utils/auth'

export const baseURL = "http://119.96.193.116:5001"   //测试环境
// export const baseURL = "http://192.168.115.56:8888"    //正式环境

/* 配置接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8*/
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: baseURL, // url = base url + request url
  // baseURL:baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['accessToken'] = getToken()
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if(res.msg == '用户名错误或账号为启用！'){ 
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log(res,"res")
      return res
    }
  },
  error => {
    console.log(error.message)
    switch (error.response.status) {
      case 401:
          setToken('')
          Message({
            message: '登录已过期请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          // setTimeout(() => {
            // store.dispatch('user/resetToken').then(() => {
            //   location.reload()
            // })
          // }, 2000);
        break;
      default:
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        break;
    }
    
    // if(res.code == 500){
    
    // }
    return Promise.reject(error)
  }
)

export default service
