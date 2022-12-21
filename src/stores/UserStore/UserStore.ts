import { makeAutoObservable } from 'mobx';

import { users } from '@stores/AuthStore/mock';
import RootStore from '@stores/RootStore';

export type UserType = {
    id: string;
    email: string;
    password: string;
    name?: string;
    surname?: string;
    username?: string;
    isAdmin: boolean;
    createdAt?: Date;
    about?: string;
};

export type UserInfoType = Pick<UserType, 'email' | 'name' | 'surname' | 'username'>;

type PrivateFields =
    | '_id'
    | '_userName'
    | '_userSurname'
    | '_email'
    | '_nickname'
    | 'password'
    | 'userId'
    | 'rootStore';

class UserStore {
    private _id = '';
    private _userName = '';
    private _userSurname = '';
    private _email = '';
    private _nickname = '';
    private _isAdmin = false;
    private _favourites: string[] = [];

    private password = '';
    private userId = '';
    private rootStore: RootStore;

    public user = {};

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get userName() {
        return this._userName;
    }

    get surname() {
        return this._userSurname;
    }

    get email() {
        return this._email;
    }

    get nickname() {
        return this._nickname;
    }

    get isAdmin() {
        return this._isAdmin;
    }

    get favourites() {
        return this._favourites;
    }

    getUser = (email: string) => {
        return users.find((user) => user.email === email);
    };

    setUserId = (id: string) => {
        this.userId = id;
    };

    setUserName = (name: string) => {
        this._userName = name;
    };

    setSurname = (surname: string) => {
        this._userSurname = surname;
    };

    setEmail = (email: string) => {
        this._email = email;
    };

    setNickname = (nick: string) => {
        this._nickname = nick;
    };

    setPassword = (hash: string) => {
        this.password = hash;
    };

    setIsAdmin = (isAdmin: boolean) => {
        this._isAdmin = isAdmin;
    };

    setFavourites = (favs: string[]) => {
        this._favourites = [...this._favourites, ...favs];
    };

    initUser = ({
        id,
        password,
        isAdmin,
        name,
        surname,
        email,
        username,
        createdAt,
        about,
    }: UserType) => {
        this.updateUserInfo({ name, surname, email, username });
        this.setIsAdmin(isAdmin);
        this.setUserId(id);
        this.setPassword(password);
    };

    updateUserInfo = ({ name, surname, email, username }: UserInfoType) => {
        this.setUserName(name || this._userName);
        this.setSurname(surname || this._userSurname);
        this.setEmail(email || this._email);
        this.setNickname(username || this._userName);
    };

    clearLocalData = () => {
        this.setUserName('');
        this.setSurname('');
        this.setEmail('');
        this.setNickname('');
        this.setIsAdmin(false);
    };
}

export default UserStore;
