import AuthStore from '@stores/AuthStore';
import UserStore from '@stores/UserStore';

class RootStore {
    authStore = new AuthStore(this);
    userStore = new UserStore(this);
}

export default RootStore;
