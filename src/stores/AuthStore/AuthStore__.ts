import { makeAutoObservable, toJS } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { UserType } from '@stores/UserStore/UserStore';
import { formUrl } from '@utils/formUrl';
import { users } from './mock';

type PrivateFields = '_isAuthenticated' | '_isAdmin' | 'userStore';

export class AuthStore {
    private rootStore: RootStore;

    private _isAuthenticated = false;
    private _token: string | null = null;
    private _userId: number | null = null;
    private _isAdmin = false;

    private _user = {} as UserType;

    private readonly storageName = 'userData';

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get userStore() {
        return this.rootStore.userStore;
    }

    get token() {
        return this._token;
    }

    get user() {
        return this._user;
    }

    get isAdmin() {
        return this._isAdmin;
    }

    setUserData = (data: UserType) => {
        this._user = data;
    };

    setUserId = (id: number) => {
        this._userId = id;
    };

    // todo email -> id ?
    getUser = (email: string) => {
        return users.find((user) => user.email === email);
    };

    setIsAuthenticated = (isAuth: boolean) => {
        this._isAuthenticated = isAuth;
    };

    setIsAdmin = (isAdmin: boolean) => {
        this._isAdmin = isAdmin;
    };

    getIsExist = (email: string, password: string) => {
        return !!users.filter((user) => user.email === email && user.password === password).length;
    };

    initUser = () => {
        const storageData = localStorage.getItem(this.storageName);
        const data = JSON.parse(String(storageData));

        if (data && data.token) {
            this.login(data.token, data.userId, data.isAdmin);
        }
    };

    login = (jwtToken: string, id: number, isAdmin: boolean) => {
        this._token = jwtToken;
        // this._userId = id;
        this.setUserId(id);
        // this.userStore.setUserId(id);
        console.log('login isAdmin', isAdmin);

        localStorage.setItem(
            this.storageName,
            JSON.stringify({ userId: id, token: jwtToken, isAdmin })
        );

        // this.userStore.initUser2();
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
                console.log(toJS(data));
                const { id, email, is_admin, name, surname, username, about, createdAt } =
                    data.dataValues;
                const { token } = data;

                // this.userStore.initUser({
                //     id: userId,
                //     isAdmin: is_admin,
                //     email,
                //     password,
                //     name,
                //     surname,
                //     username,
                //     about,
                //     createdAt,
                // });

                // console.log('data.dataValues', data.dataValues);
                this.setUserData({
                    id,
                    isAdmin: is_admin,
                    email,
                    password,
                    name,
                    surname,
                    username,
                    about,
                    createdAt,
                });
                // this.userStore.setUserData(data.dataValues);
                this.login(token, id, is_admin);
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

// export default AuthStore;
