import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { RefType } from '@typings/api';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

type PrivateFields = 'rootStore';

class RefStore {
    private rootStore: RootStore;

    private _allRefs: RefType[] = [];

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get token() {
        return this.rootStore.authStore.token;
    }

    get allRefs() {
        return this._allRefs;
    }

    setAllRefs = (refs: RefType[]) => {
        this._allRefs = refs;
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
                this.rootStore.collectionStore.setFavourites(data.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getRefs: ${err.message}`);
        }
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
                method: endpoints.addToCollection.method,
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

    findAuthorByNickName = async (nick: string) => {
        await this.rootStore.userStore.getAuthors();
        return this.rootStore.userStore.authors.find((author) => author.nickname === nick);
    };
}

export default RefStore;
