/*
 * @Author: 唔系_wzx
 * @Date: 2022-04-26 21:15:58
 * @LastEditors: 唔系_wzx
 * @LastEditTime: 2022-07-22 17:16:54
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
  // devServer: {
  //   proxy: {
  //     '/': {
  //       target: 'http://120.25.252.242',
  //     },
  //   }
  // },
})