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