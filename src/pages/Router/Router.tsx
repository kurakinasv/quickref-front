import React, { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import MainPage from '@pages/MainPage';
import RefsPage from '@pages/RefsPage';
import { useAuthStore } from '@stores/AuthStore';

export enum PathsEnum {
    main = '/',
    refs = '/refs',
    profile = '/profile',
}

const Router: FC = () => {
    const { isAuthenticated } = useAuthStore();

    const authRoutes = isAuthenticated
        ? [
              {
                  path: PathsEnum.profile,
                  element: <div>profile page</div>,
              },
          ]
        : [];

    const router = createBrowserRouter([
        {
            path: PathsEnum.main,
            element: <MainPage />,
            errorElement: <div>An unexpected error has occured :C</div>,
        },
        {
            path: PathsEnum.refs,
            element: <RefsPage />,
        },
        ...authRoutes,
    ]);

    return <RouterProvider router={router} />;
};

export default observer(Router);
