import React from 'react';

import Router from '@pages/Router';
import RootStoreProvider from '@stores/RootStore/context';

const App = () => {
    return (
        <RootStoreProvider>
            <Router />
        </RootStoreProvider>
    );
};

export default App;
