import React from 'react'
import axios from 'axios'
const HOST = 'http://localhost:7001';

//https://github.com/axios/axios
export function get(url) {
    return axios({
        url: url,
        method: 'get',
        timeout: 8000,
        baseURL: HOST,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'csrftoken',
        withCredentials: true
    }).then(response => {
        return response.data;
    })
}

export function post(url, data) {
    return axios({
        url: url,
        method: 'post',
        data,
        timeout: 8000,
        baseURL: HOST,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'csrftoken',
        withCredentials: true
    }).then(response => {
        return response.data;
    })
}

export function put(url, data) {
    return axios({
        url: url,
        method: 'put',
        data,
        timeout: 8000,
        baseURL: HOST,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'csrftoken',
        withCredentials: true
    }).then(response => {
        return response.data;
    })
}

export function del(url,data) {
    console.log('del baseURL',HOST);
    return axios({
        url: url,
        method: 'delete',
        data,
        timeout: 8000,
        baseURL: HOST,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'csrftoken',
        withCredentials: true
    }).then(response => {
        return response.data;
    })
}

axios.interceptors.request.use(
    config => {
      const token = sessionStorage.getItem('BLOG_TOKEN');
      if (token) {
        // Bearer是JWT的认证头部信息
        config.headers.common['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 401) {
          window.location.hash='/';
      } else {
         window.location.hash='/';
      }
      return Promise.reject(error);
    }
  );
  