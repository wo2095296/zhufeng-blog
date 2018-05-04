import {get,post,del,put} from './index';
const entity='/api/categories';
//查询文章列表
export function list({ pageNum = 1, pageSize = 5, keyword = '' }) {
    return get(`${entity}?pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyword}`);
}

export function create(data) {
    return post(`${entity}`, data);
}

export function update(id, data) {
    return put(`${entity}/${id}`, data);
}
export function remove(ids) {
    if (typeof ids=='string') {
        ids = [ids]
    }
    return del(`${entity}/${ids[0]}`,{ids});
}


export default {
    list,
    create,
    update,
    remove
}
