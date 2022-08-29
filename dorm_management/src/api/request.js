/*
 * @Author: 唔系_wzx
 * @Date: 2022-05-08 14:59:25
 * @LastEditors: 唔系_wzx
 * @LastEditTime: 2022-07-22 17:15:04
 */
// 对axios进行二次封装，设置请求拦截器和响应拦截器
import axios from 'axios'

// 设置请求样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置请求基本信息
const requests = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'http://120.25.252.242:3000',
  timeout: 5000
})

// 设置请求拦截器
requests.interceptors.request.use((config) => {
  // nprogress.start()
  return config
}, error => {
  return Promise.reject(error)
})

// 设置响应拦截器
requests.interceptors.request.use((response) => {
  // nprogress.done()
  return response
}, error => {
  return Promise.reject(error)
})

export default requests

