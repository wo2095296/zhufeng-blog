import { get, post } from './index';
export function signup(data) {
    return post('/user/signup', data);
}

export function signin(data) {
    return post('/user/signin', data);
}

export function signout() {
    return get('/user/signout');
}

export default {
    signup,
    signin,
    signout
}