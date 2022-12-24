import { makeAutoObservable } from 'mobx';

import RootStore from '@stores/RootStore';

type PrivateFields = 'rootStore';

class Meta {
    private rootStore: RootStore;

    private _isError = false;

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get isError() {
        return this._isError;
    }

    setIsError = (err: boolean) => {
        this._isError = err;
    };
}

export default Meta;
