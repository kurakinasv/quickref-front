import AuthorsStore from '@stores/AuthorsStore';
import AuthStore from '@stores/AuthStore';
import CollectionStore from '@stores/CollectionStore';
import Meta from '@stores/Meta';
import RefStore from '@stores/RefStore';
import UserStore from '@stores/UserStore';

class RootStore {
    authStore = new AuthStore(this);
    userStore = new UserStore(this);
    collectionStore = new CollectionStore(this);
    refStore = new RefStore(this);
    authorsStore = new AuthorsStore(this);
    meta = new Meta(this);
}

export default RootStore;
