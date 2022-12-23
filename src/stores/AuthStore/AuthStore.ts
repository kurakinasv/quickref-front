import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { formUrl } from '@utils/formUrl';

type PrivateFields = 'rootStore';

class AuthStore {
    private rootStore: RootStore;

    private _isAuthenticated = false;
    private _isAdmin = false;
    private _token: string | null = null;

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

    setToken = (token: string | null) => {
        this._token = token;
    };

    setIsAuthenticated = (isAuth: boolean) => {
        this._isAuthenticated = isAuth;
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
        this.rootStore.userStore.setUserId(userId);
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
        this.rootStore.userStore.setUserId(null);

        localStorage.removeItem(this.storageName);

        this.setIsAdmin(false);
        this.setIsAuthenticated(false);
    };
}

export default AuthStore;
