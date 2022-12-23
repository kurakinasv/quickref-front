import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import {
    AuthorType,
    CategoryType,
    ImageCollectionType,
    RefType,
    UserInfoType,
    UserType,
} from '@typings/api';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

type PrivateFields = 'rootStore';

class UserStore {
    private rootStore: RootStore;

    private _user = {} as UserType;
    private _userId: number | null = null;
    private _favourites: string[] = [];
    private _author: AuthorType | null = null;
    private _authors: AuthorType[] = [];
    private _allRefs: RefType[] = [];
    private _categories: CategoryType[] = [];
    private _favImages: RefType[] = [];

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

    get favImages() {
        return this._favImages;
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

    setFavourites = (favs: string[]) => {
        this._favourites = [...this._favourites, ...favs];
    };

    setCategories = (categories: CategoryType[]) => {
        this._categories = categories;
    };

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

    getCollection = async (id?: number) => {
        const url = formUrl(`${endpoints.getCollections.url}/${id || 'fav'}`);

        try {
            const response = await fetch(url, {
                method: endpoints.getCollections.method,
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data: { collection: any; imgCol: ImageCollectionType[] } = await response.json();

            if (data) {
                await this.getRefs();
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
        const url = formUrl(endpoints.getImages.url);

        try {
            const response = await fetch(url, {
                method: endpoints.getImages.method,
                headers,
            });
            const data: RefType[] = await response.json();

            if (data) {
                this.setAllRefs(data);
                this.setFavourites(data.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getRefs: ${err.message}`);
        }
    };

    getAuthors = async (id?: number) => {
        const url = formUrl(endpoints.getAuthors.url);

        try {
            const response = await fetch(`${url}${id || ''}`, {
                method: endpoints.getAuthors.method,
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
            throw Error(`getAuthors: ${err.message}`);
        }
    };

    findAuthorByNickName = async (nick: string) => {
        await this.getAuthors();
        return this.authors.find((a) => a.nickname === nick);
    };

    uploadImage = async (
        date_upload: Date,
        source: string,
        categoryId: number,
        nickname: string,
        name: File
    ) => {
        const url = formUrl(endpoints.uploadImage.url);

        try {
            const author = await this.findAuthorByNickName(nickname);

            const toSend = new FormData();
            toSend.append('files', name);
            toSend.append(
                'info',
                JSON.stringify({
                    date_upload,
                    source,
                    categoryId: categoryId + 1,
                    authorId: author?.id,
                })
            );

            const response = await fetch(url, {
                method: endpoints.uploadImage.method,
                body: toSend,
                headers: getAuthHeader(this.token),
            });
            const data: RefType[] = await response.json();

            if (!data) {
                throw new Error('Не удалось загрузить изображение');
            }
        } catch (err: any) {
            throw Error(`getRefs: ${err.message}`);
        }
    };

    addToCollection = async (imageId: number) => {
        const url = formUrl(endpoints.addToCollection.url);

        try {
            const id = imageId;
            const response = await fetch(url, {
                method: endpoints.addToCollection.url,
                body: JSON.stringify({ id, collectionId: null }),
                headers: { ...headers, ...getAuthHeader(this.token) },
            });
            const data: RefType[] = await response.json();

            if (!data) {
                throw new Error('Не удалось добавить в коллекцию');
            }
        } catch (err: any) {
            throw Error(`addToCollection: ${err.message}`);
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
