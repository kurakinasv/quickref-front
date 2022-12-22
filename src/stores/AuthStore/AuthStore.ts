import { makeAutoObservable, toJS } from 'mobx';

import { BASE_URL } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import UserStore from '@stores/UserStore';
import { users } from './mock';

type PrivateFields = '_isAuthenticated' | '_isAdmin' | 'userStore';

const formUrl = (endpoint: string) => {
    return BASE_URL + 'api' + endpoint;
};

const headers = { 'Content-Type': 'application/json' };

class AuthStore {
    private userStore: UserStore;

    private _isAuthenticated = false;
    private _token: string | null = null;
    private _userId: number | null = null;

    private readonly storageName = 'userData';

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.userStore = rootStore.userStore;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    // todo email -> id ?
    getUser = (email: string) => {
        return users.find((user) => user.email === email);
    };

    setIsAuthenticated = (isAuth: boolean) => {
        this._isAuthenticated = isAuth;
    };

    getIsExist = (email: string, password: string) => {
        return !!users.filter((user) => user.email === email && user.password === password).length;
    };

    initUser = () => {
        const storageData = localStorage.getItem(this.storageName);
        const data = JSON.parse(String(storageData));

        if (data && data.token) {
            this.login(data.token, data.userId);
        }
    };

    login = (jwtToken: string, id: number) => {
        this._token = jwtToken;
        this._userId = id;

        localStorage.setItem(this.storageName, JSON.stringify({ userId: id, token: jwtToken }));

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
                this.login(data.token, data.userId);
            }
        } catch (err: any) {
            throw new Error(err.message);
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
                this.loginHandler(email, password);
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    logoutHandler = () => {
        this._token = null;
        this._userId = null;
        localStorage.removeItem(this.storageName);

        this.setIsAuthenticated(false);
    };
}

export default AuthStore;
