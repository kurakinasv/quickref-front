import { makeAutoObservable, toJS } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

export type UserType = {
    id: number;
    email: string;
    password: string;
    isAdmin: boolean;
    name?: string;
    surname?: string;
    username?: string;
    about?: string;
    createdAt: string;
};

export type UserInfoType = Pick<UserType, 'email' | 'name' | 'surname' | 'username'>;

type PrivateFields = 'rootStore';

class UserStore {
    private rootStore: RootStore;

    private _user = {} as UserType;
    private _userId: number | null = null;
    private _favourites: string[] = [];

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get token() {
        return this.rootStore.authStore.token;
    }

    get user() {
        return this._user;
    }

    get userId() {
        return this._userId;
    }

    get favourites() {
        return this._favourites;
    }

    setUserData = (data: UserType) => {
        this._user = data;
    };

    setUserId = (id: number | null) => {
        this._userId = id;
    };

    setFavourites = (favs: string[]) => {
        this._favourites = [...this._favourites, ...favs];
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

export default UserStore;
