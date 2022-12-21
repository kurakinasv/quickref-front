import React, { createContext, FC, PropsWithChildren, useContext } from 'react';

import RootStore from './RootStore';

const rootStore = new RootStore();

const RootContext = createContext(rootStore);

export const useRootStore = () => {
    const context = useContext(RootContext);

    if (!context) {
        throw Error('RootStore must be used inside provider');
    }

    return context;
};

const RootStoreProvider: FC<PropsWithChildren> = ({ children }) => {
    return <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>;
};

export default RootStoreProvider;
