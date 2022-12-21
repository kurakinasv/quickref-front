import React, { FC } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import AdminPage from '@pages/AdminPage';
import Categories from '@pages/Categories/Categories';
import MainPage from '@pages/MainPage';
import ProfilePage from '@pages/ProfilePage';
import RefsPage from '@pages/RefsPage';
import { useAuthStore, useUserStore } from '@stores/RootStore/hooks';

export enum PathsEnum {
    main = '/',
    profile = 'profile',
    admin = 'admin',
    refs = '/refs',
}

const Router: FC = () => {
    const { isAuthenticated } = useAuthStore();
    const { isAdmin } = useUserStore();

    const authChildrenRoutes = isAuthenticated
        ? [
              {
                  path: PathsEnum.profile,
                  element: <ProfilePage />,
              },
          ]
        : [];

    const adminRoutes =
        isAuthenticated && isAdmin
            ? [
                  {
                      path: PathsEnum.admin,
                      element: <AdminPage />,
                  },
              ]
            : [];

    const router = createBrowserRouter([
        {
            path: PathsEnum.main,
            element: <MainPage />,
            errorElement: <div>An unexpected error has occured :C</div>,
            children: [
                {
                    index: true,
                    element: <Categories />,
                },
                ...authChildrenRoutes,
                ...adminRoutes,
            ],
        },
        {
            path: PathsEnum.refs,
            element: <RefsPage />,
        },
        {
            path: '*',
            element: <Navigate to={PathsEnum.main} replace />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default observer(Router);
