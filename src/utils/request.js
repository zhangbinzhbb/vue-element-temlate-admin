import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import qs from 'qs';

const setDefaultParams = (params) => {
  return params;
};

const resolve = function (response, success, error) {
  // const status = response.statue || response.status
  success(response);
};

const reject = function (response, error) {
  if (error) {
    error(response);
  }
};

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

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
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

service.get = (path, params, success, error) => {
  const paramsData = Object.assign(
    {
      t: new Date().getTime(),
    },
    params
  );
  params = setDefaultParams(paramsData);
  const res = service({
    url: path + '?' + qs.stringify(params),
    method: 'get',
    data: params,
    transformRequest: function (obj) {
      let ret = '';
      for (const it in obj) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(obj[it]) + '&';
      }
      return ret;
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res.then(
    (response) => {
      resolve(response, success, error);
    },
    (response) => {
      reject(response, error);
    }
  );
};

service.post = (path, params, success, error) => {
  params = setDefaultParams(params);
  const res = service({
    url: path,
    method: 'post',
    params: params,
  });
  res.then(
    (response) => {
      resolve(response, success, error);
    },
    (response) => {
      reject(response, error);
    }
  );
};

service.postJson = (path, params, success, error) => {
  params = setDefaultParams(params);
  const res = service({
    url: path,
    method: 'post',
    data: params,
    transformRequest: function (obj) {
      return JSON.stringify(obj);
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res.then(
    (response) => {
      resolve(response, success, error);
    },
    (response) => {
      reject(response, error);
    }
  );
  return res;
};

export default service;
