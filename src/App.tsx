import React from 'react';

import AuthStoreProvider from '@stores/AuthStore/AuthStore.context';
import MainPage from './pages/MainPage';

const App = () => {
    return (
        <AuthStoreProvider>
            <MainPage />
        </AuthStoreProvider>
    );
};

export default App;
