import { makeAutoObservable, toJS } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { UserInfoType, UserType } from '@stores/UserStore/UserStore';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

type PrivateFields = 'rootStore';

class AuthStore {
    private rootStore: RootStore;

    private _isAuthenticated = false;
    private _isAdmin = false;
    private _token: string | null = null;
    private _userId: number | null = null;

    private _user = {} as UserType;

    private readonly storageName = 'userData';

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get token() {
        return this._token;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get isAdmin() {
        return this._isAdmin;
    }

    get userId() {
        return this._userId;
    }

    get user() {
        return this._user;
    }

    setUserData = (data: UserType) => {
        this._user = data;
    };

    setToken = (token: string | null) => {
        this._token = token;
    };

    setIsAuthenticated = (isAuth: boolean) => {
        this._isAuthenticated = isAuth;
    };

    setUserId = (id: number | null) => {
        this._userId = id;
    };

    setIsAdmin = (isAdmin: boolean) => {
        this._isAdmin = isAdmin;
    };

    initUser = () => {
        const storageData = localStorage.getItem(this.storageName);
        const data = JSON.parse(String(storageData));

        if (data && data.token) {
            const { token, userId, isAdmin } = data;
            this.login(token, userId, isAdmin);
        }
    };

    login = (token: string, userId: number, isAdmin: boolean) => {
        localStorage.setItem(this.storageName, JSON.stringify({ userId, token, isAdmin }));

        this.setToken(token);
        this.setUserId(userId);
        this.setIsAdmin(isAdmin);
        this.setIsAuthenticated(true);
    };

    loginHandler = async (email: string, password: string) => {
        const url = formUrl(endpoints.login.url);

        try {
            const response = await fetch(url, {
                method: endpoints.login.method,
                body: JSON.stringify({ email, password }),
                headers,
            });

            const data = await response.json();

            if (data) {
                this.login(data.token, data.dataValues.id, data.dataValues.is_admin);
            }
        } catch (err: any) {
            throw new Error(`loginHandler: ${err.message}`);
        }
    };

    registerHandler = async (email: string, password: string) => {
        const url = formUrl(endpoints.register.url);

        try {
            const response = await fetch(url, {
                method: endpoints.register.method,
                body: JSON.stringify({ email, password }),
                headers,
            });

            const data = await response.json();

            if (data) {
                this.login(data.token, data.dataValues.id, data.dataValues.is_admin);
            }
        } catch (err: any) {
            throw new Error(`registerHandler: ${err.message}`);
        }
    };

    logoutHandler = () => {
        this.setToken(null);
        this.setUserId(null);

        localStorage.removeItem(this.storageName);

        this.setIsAdmin(false);
        this.setIsAuthenticated(false);
    };

    getUser = async () => {
        const url = formUrl(endpoints.getUser.url);

        try {
            const response = await fetch(url, {
                method: endpoints.getUser.method,
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data = await response.json();

            if (data) {
                console.log('getUser', toJS(data));

                const {
                    about,
                    createdAt,
                    email,
                    id,
                    is_admin: isAdmin,
                    name,
                    password,
                    surname,
                    username,
                } = data;

                this.setUserData({
                    about,
                    createdAt,
                    email,
                    id,
                    isAdmin,
                    name,
                    password,
                    surname,
                    username,
                });
            }
        } catch (err: any) {
            throw new Error(`getUser: ${err.message}`);
        }
    };

    editUser = async ({ name, surname, email, username }: UserInfoType) => {
        const url = formUrl(endpoints.editUser.url);

        try {
            console.log();

            const response = await fetch(url, {
                method: endpoints.editUser.method,
                body: JSON.stringify({ id: this.userId, name, surname, email, username }),
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data = await response.json();

            if (data) {
                console.log(data);

                this.setUserData(data);
                await this.getUser();
            }
        } catch (err: any) {
            throw Error(`editUser: ${err.message}`);
        }
    };
}

export default AuthStore;
