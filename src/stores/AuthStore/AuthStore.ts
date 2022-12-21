import { makeAutoObservable } from 'mobx';

import RootStore from '@stores/RootStore';
import UserStore from '@stores/UserStore';
import { users } from './mock';

type PrivateFields = '_isAuthenticated' | '_isAdmin' | 'userStore';

class AuthStore {
    private userStore: UserStore;

    private _isAuthenticated = false;

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

    loginHandler = (email: string, password: string) => {
        if (this.getIsExist(email, password)) {
            this.setIsAuthenticated(true);
            return;
        }

        throw new Error('This user is not exist');
    };

    registerHandler = (email: string, password: string) => {
        if (this.getIsExist(email, password)) {
            throw new Error('This user is already exist');
        }

        users.push({
            id: String(Number(users[users.length - 1].id) + 1),
            email,
            password,
            isAdmin: false,
        });

        this.setIsAuthenticated(true);
    };

    logoutHandler = () => {
        this.setIsAuthenticated(false);
    };
}

export default AuthStore;
