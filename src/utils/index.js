/*
 * @Author: zhangbb
 * @Date: 2020-09-22 14:11:59
 * @Last Modified by: zhangbb
 * @Last Modified time: 2020-09-22 14:11:59
 */

import * as filters from '../filters'; // global filters
import request from './request';
import './error-log'; // error log

export default {
  install: (Vue) => {
    // 绑定到vue实例的原型链上，这样可以在组件中直接调用this.$axios.get()，而不需要用import引入axios模块
    Vue.prototype.$axios = request;
    // register global utility filters
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key]);
    });
  },
};
