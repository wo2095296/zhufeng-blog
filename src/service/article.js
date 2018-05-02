import { get, post } from './index';
export function list({ pageNum = 1, pageSize = 5, keyword = '' }) {
    return get(`/article/list?pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyword}`);
}

export function add(data) {
    return post('/article/add', data);
}

export function update(id, data) {
    return post(`/article/update/${id}`, data);
}
export function remove(id) {
    return get(`/article/remove/${id}`);
}

export default {
    list,
    add,
    update,
    remove
}
