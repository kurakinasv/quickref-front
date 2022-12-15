import React, { createContext, FC, PropsWithChildren, useContext } from 'react';

import AuthStore from './AuthStore';

const authStore = new AuthStore();

const AuthContext = createContext<AuthStore>(authStore);

export const useAuthStore = () => {
    const authStoreContext = useContext(AuthContext);

    if (!authStoreContext) {
        throw new Error('AuthStore must be used within provider');
    }

    return authStoreContext;
};

const AuthStoreProvider: FC<PropsWithChildren> = ({ children }) => {
    const authStore = useAuthStore();

    return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>;
};

export default AuthStoreProvider;
