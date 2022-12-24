import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { ImageCollectionType, RefType } from '@typings/api';
import { formUrl } from '@utils/formUrl';
import { getAuthHeader } from '@utils/getAuthHeader';

type PrivateFields = 'rootStore';

class CollectionStore {
    private rootStore: RootStore;

    private _favourites: string[] = [];
    private _favImages: RefType[] = [];
    private _collectionId: number | null = null;
    private _description = '';

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get token() {
        return this.rootStore.authStore.token;
    }

    get favourites() {
        return this._favourites;
    }

    get favImages() {
        return this._favImages;
    }

    get collectionId() {
        return this._collectionId;
    }

    get description() {
        return this._description;
    }

    setFavourites = (favs: string[]) => {
        this._favourites = [...this._favourites, ...favs];
    };

    setFavImages = (favs: RefType[]) => {
        this._favImages = favs;
    };

    setCollectionId = (id: number) => {
        this._collectionId = id;
    };

    setDescription = (description: string) => {
        this._description = description;
    };

    getCollection = async (id?: number) => {
        const url = formUrl(`${endpoints.getCollections.url}/${id || 'fav'}`);

        try {
            const response = await fetch(url, {
                method: endpoints.getCollections.method,
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data: { dataValues: any; imgCol: ImageCollectionType[] } = await response.json();

            if (data) {
                await this.rootStore.refStore.getRefs();

                const { imgCol } = data; // [{imageId: 3, ...}, {}...]

                const arrId = imgCol.map(({ imageId }) => imageId);

                const favs = this.rootStore.refStore.allRefs.filter((ref) =>
                    arrId.includes(ref.id)
                );

                this.setCollectionId(data.dataValues.id);
                this.setDescription(data.dataValues.description);
                this.setFavImages(favs);
                this.setFavourites(favs.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getCollection: ${err.message}`);
        }
    };

    editCollection = async (description: string) => {
        const url = formUrl(endpoints.editCollection.url);

        try {
            const response = await fetch(url, {
                method: endpoints.editCollection.method,
                body: JSON.stringify({
                    userId: this.rootStore.userStore.userId,
                    id: this.collectionId,
                    description,
                }),
                headers: { ...headers, ...getAuthHeader(this.token) },
            });

            const data = await response.json();

            if (!data) {
                throw Error('Коллекция не была изменена');
            }
        } catch (err: any) {
            throw Error(`getCollection: ${err.message}`);
        }
    };
}

export default CollectionStore;
