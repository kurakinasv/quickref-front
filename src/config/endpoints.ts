enum HttpMetods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

const endpoints = {
    // auth
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

    // user
    getUser: {
        method: HttpMetods.GET,
        url: '/user/',
    },
    editStatus: {
        method: HttpMetods.POST,
        url: '/user/editStatus',
    },
    editUser: {
        method: HttpMetods.POST,
        url: '/user/edit',
    },

    // images
    getImages: {
        method: HttpMetods.GET,
        url: '/image/images',
    },
    uploadImage: {
        method: HttpMetods.POST,
        url: '/image/upload',
    },
    addToCollection: {
        method: HttpMetods.POST,
        url: '/image/add',
    },
    removeFromCollection: {
        method: HttpMetods.DELETE,
        url: '/image/remove',
    },

    // colllections
    getCollections: {
        method: HttpMetods.GET,
        url: '/collection/',
    },
    editCollection: {
        method: HttpMetods.POST,
        url: '/collection/edit',
    },

    // authors
    getAuthors: {
        method: HttpMetods.GET,
        url: '/author/',
    },

    // categories
    getCategories: {
        method: HttpMetods.GET,
        url: '/category/',
    },
};

export default endpoints;
