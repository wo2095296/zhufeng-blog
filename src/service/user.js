import { get, post } from './index';
export function signup(data) {
    return post('/user/signup', data);
}

export function signin(data) {
    return post('/user/signin',data).then((res) => {
        sessionStorage.setItem('BLOG_TOKEN',res.data);
        return res;
    });
}

export function signout() {
    return get('/user/signout');
}

export default {
    signup,
    signin,
    signout
}