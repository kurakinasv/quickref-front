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

    setFavourites = (favs: string[]) => {
        this._favourites = [...this._favourites, ...favs];
    };

    setFavImages = (favs: RefType[]) => {
        this._favImages = favs;
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
                await this.rootStore.refStore.getRefs();

                const { imgCol } = data; // [{imageId: 3, ...}, {}...]

                const arrId = imgCol.map(({ imageId }) => imageId);

                const favs = this.rootStore.refStore.allRefs.filter((ref) =>
                    arrId.includes(ref.id)
                );

                this.setFavImages(favs);
                this.setFavourites(favs.map((ref) => ref.name));
            }
        } catch (err: any) {
            throw Error(`getCollection: ${err.message}`);
        }
    };
}

export default CollectionStore;
