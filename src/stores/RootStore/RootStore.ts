import AuthStore from '@stores/AuthStore';
import CollectionStore from '@stores/CollectionStore';
import RefStore from '@stores/RefStore';
import UserStore from '@stores/UserStore';

class RootStore {
    authStore = new AuthStore(this);
    userStore = new UserStore(this);
    collectionStore = new CollectionStore(this);
    refStore = new RefStore(this);
}

export default RootStore;
