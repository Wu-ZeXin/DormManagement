"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _nprogress = _interopRequireDefault(require("nprogress"));

require("nprogress/nprogress.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
 * @Author: 唔系_wzx
 * @Date: 2022-05-08 14:59:25
 * @LastEditors: 唔系_wzx
 * @LastEditTime: 2022-07-22 17:15:04
 */
// 对axios进行二次封装，设置请求拦截器和响应拦截器
// 设置请求样式
// 设置请求基本信息
var requests = _axios["default"].create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'http://120.25.252.242:3000',
  timeout: 5000
}); // 设置请求拦截器


requests.interceptors.request.use(function (config) {
  // nprogress.start()
  return config;
}, function (error) {
  return Promise.reject(error);
}); // 设置响应拦截器

requests.interceptors.request.use(function (response) {
  // nprogress.done()
  return response;
}, function (error) {
  return Promise.reject(error);
});
var _default = requests;
exports["default"] = _default;