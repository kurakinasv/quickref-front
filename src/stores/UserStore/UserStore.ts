import { makeAutoObservable, toJS } from 'mobx';

import { BASE_URL, headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { AuthorType, RefType } from '@typings/api';
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
    private _author: AuthorType | null = null;
    private _authors: AuthorType[] = [];
    private _allRefs: RefType[] = [];

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get allRefs() {
        return this._allRefs;
    }

    get author() {
        return this._author;
    }

    get authors() {
        return this._authors;
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

    _favImages: RefType[] = [];

    get favImages() {
        return this._favImages;
    }

    setFavImages = (favs: RefType[]) => {
        this._favImages = favs;
    };

    setAuthor = (author: AuthorType | null) => {
        this._author = author;
    };

    setAllAuthors = (authors: AuthorType[]) => {
        this._authors = authors;
    };

    setAllRefs = (refs: RefType[]) => {
        this._allRefs = refs;
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

    getCollection = async (id?: number) => {
        // todo delete mock id
        const url = formUrl(`${endpoints.getCollections.url}/${id || 'fav'}`);

        try {
            const response = await fetch(url, {
                method: endpoints.getCollections.method,
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data: { collection: any; imgCol: ImageCollectionType[] } = await response.json();

            if (data) {
                await this.getRefs();
                console.log(data);
                const { imgCol } = data; // [{imageId: 3, ...}, {}...]

                const arrId = imgCol.map(({ imageId }) => imageId);

                const favs = this.allRefs.filter((ref) => arrId.includes(ref.id));
                this.setFavImages(favs);

                this.setFavourites(favs.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getCollection: ${err.message}`);
        }
    };

    getRefs = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/image/images`, {
                method: 'GET',
                headers,
            });
            const data: RefType[] = await response.json();

            if (data) {
                this.setAllRefs(data);
                console.log(data.map((ref) => ref.name));

                this.setFavourites(data.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getRefs: ${err.message}`);
        }
    };

    getAuthor = async (id?: number) => {
        try {
            const response = await fetch(`${BASE_URL}api/author/${id || ''}`, {
                method: 'GET',
                headers,
            });
            const data = await response.json();

            if (data) {
                if (id) {
                    this.setAuthor(data);
                } else {
                    this.setAllAuthors(data);
                }
            }
        } catch (err: any) {
            throw Error(`getAuthor: ${err.message}`);
        }
    };

    findAuthorByNickName = async (nick: string) => {
        await this.getAuthor();
        return this.authors.find((a) => a.nickname === nick);
    };

    // https://unsplash.com/photos/gKXKBY-C-Dk
    // https://unsplash.com/@madhatterzone
    uploadImage = async (
        date_upload: Date,
        source: string,
        categoryId: number,
        nickname: string,
        name: File
    ) => {
        try {
            const author = await this.findAuthorByNickName(nickname);
            console.log(toJS(author));

            const toSend = new FormData();
            toSend.append('files', name);
            toSend.append(
                'info',
                JSON.stringify({ date_upload, source, categoryId, authorId: author?.id })
            );

            const response = await fetch(`${BASE_URL}api/image/upload`, {
                method: 'POST',
                body: toSend,
                headers: getAuthHeader(this.token),
            });
            const data: RefType[] = await response.json();

            if (data) {
                console.log(toJS(data));
            }
        } catch (err: any) {
            throw Error(`getRefs: ${err.message}`);
        }
    };

    addToCollection = async (imageId: number) => {
        try {
            const id = imageId;
            const response = await fetch(`${BASE_URL}api/image/add`, {
                method: 'POST',
                body: JSON.stringify({ id, collectionId: null }),
                headers: { ...headers, ...getAuthHeader(this.token) },
            });
            const data: RefType[] = await response.json();

            if (data) {
                console.log(toJS(data));
            }
        } catch (err: any) {
            throw Error(`addToCollection: ${err.message}`);
        }
    };
}

export type ImageCollectionType = {
    collectionId: number;
    createdAt: string;
    imageId: number;
    updatedAt: string;
};

export default UserStore;
