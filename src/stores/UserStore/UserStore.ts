import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { CategoryType, UserInfoType, UserType } from '@typings/api';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

type PrivateFields = 'rootStore';

class UserStore {
    private rootStore: RootStore;

    private _user = {} as UserType;
    private _userId: number | null = null;
    private _categories: CategoryType[] = [];

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

    get categories() {
        return this._categories;
    }

    setUserData = (data: UserType) => {
        this._user = data;
    };

    setUserId = (id: number | null) => {
        this._userId = id;
    };

    setCategories = (categories: CategoryType[]) => {
        this._categories = categories;
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
            const response = await fetch(url, {
                method: endpoints.editUser.method,
                body: JSON.stringify({ id: this.userId, name, surname, email, username }),
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data = await response.json();

            if (data) {
                this.setUserData(data);
                await this.getUser();
            }
        } catch (err: any) {
            throw Error(`editUser: ${err.message}`);
        }
    };

    getCategories = async () => {
        const url = formUrl(endpoints.getCategories.url);

        try {
            const response = await fetch(url, {
                method: endpoints.getCategories.method,
                headers,
            });
            const data: CategoryType[] = await response.json();

            if (data) {
                this.setCategories(data);
            }
        } catch (err: any) {
            throw Error(`getCategories: ${err.message}`);
        }
    };
}

export default UserStore;
