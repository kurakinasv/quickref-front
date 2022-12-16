import { makeAutoObservable } from 'mobx';

import { users } from './mock';

class AuthStore {
    private _isAuthenticated = false;
    private _isAdmin = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get isAdmin() {
        return this._isAdmin;
    }

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

    loginHandler = (email: string, password: string) => {
        if (this.getIsExist(email, password)) {
            this.setIsAuthenticated(true);
            this.setIsAdmin(!!this.getUser(email)?.isAdmin);
            return;
        }

        throw new Error('This user is not exist');
    };

    registerHandler = (email: string, password: string) => {
        if (this.getIsExist(email, password)) {
            throw new Error('This user is already exist');
        }

        users.push({ id: String(Number(users[users.length - 1].id) + 1), email, password });

        this.setIsAuthenticated(true);
    };

    logoutHandler = () => {
        this.setIsAuthenticated(false);
        this.setIsAdmin(false);
    };
}

export default AuthStore;
