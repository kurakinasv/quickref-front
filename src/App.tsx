import React from 'react';

import Router from '@pages/Router';
import { AuthStoreProvider } from '@stores/AuthStore';

const App = () => {
    return (
        <AuthStoreProvider>
            <Router />
        </AuthStoreProvider>
    );
};

export default App;
