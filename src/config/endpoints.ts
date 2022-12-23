enum HttpMetods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

const endpoints = {
    // auth & user
    auth: {
        method: HttpMetods.GET,
        url: '/user/auth',
    },
    login: {
        method: HttpMetods.POST,
        url: '/user/login',
    },
    register: {
        method: HttpMetods.POST,
        url: '/user/register',
    },
    editStatus: {
        method: HttpMetods.POST,
        url: '/user/editStatus',
    },
    editUser: {
        method: HttpMetods.POST,
        url: '/user/edit',
    },
    getUser: {
        method: HttpMetods.GET,
        url: '/user/',
    },
};

export default endpoints;
