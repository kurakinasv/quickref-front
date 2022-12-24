import React, { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import Router from '@pages/Router';
import RootStoreProvider from '@stores/RootStore/context';
import { useAuthStore, useRefStore, useUserStore } from '@stores/RootStore/hooks';

const App: FC = () => {
    const { initUser, isAuthenticated } = useAuthStore();
    const { getUser } = useUserStore();
    const { getRefs } = useRefStore();

    const init = async () => {
        initUser();
        await getRefs();

        if (isAuthenticated) {
            await getUser();
        }
    };

    useEffect(() => {
        init();
    }, [isAuthenticated]);

    return (
        <RootStoreProvider>
            <Router />
        </RootStoreProvider>
    );
};

export default observer(App);
