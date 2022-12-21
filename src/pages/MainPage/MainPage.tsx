import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import useModal from '@hooks/useModal';
import { Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { collections } from '@pages/RefsPage/mock';
import { PathsEnum } from '@pages/Router';
import { useAuthStore, useUserStore } from '@stores/RootStore/hooks';
import { modalBoxStyle } from '@styles/consts';

import {
    Container,
    ContentWrapper,
    Footer,
    FooterLink,
    Header,
    LinkButton,
    Logo,
    NavBar,
    NavLink,
} from './MainPage.styles';

const MainPage = () => {
    const { isAuthenticated, loginHandler, registerHandler, logoutHandler } = useAuthStore();
    const { isAdmin } = useUserStore();

    const [isRegistered, setIsRegistered] = useState(true);

    const { open, openModal, closeModal } = useModal();

    const [value, setValue] = useState({ email: '', password: '' });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue((val) => ({ ...val, [name]: value }));
    };

    const handleLogin = () => {
        const { email, password } = value;
        isRegistered ? loginHandler(email, password) : registerHandler(email, password);
        closeModal();
    };

    const toggleForm = () => {
        setIsRegistered((v) => !v);
    };

    return (
        <>
            <Container>
                <Header>
                    <Logo to={PathsEnum.main}>QuickRef</Logo>
                    <NavBar>
                        {isAuthenticated && (
                            <>
                                {isAdmin && <NavLink to={PathsEnum.admin}>Админ-панель</NavLink>}
                                <NavLink to={PathsEnum.profile}>Профиль</NavLink>
                                <NavLink to={`${PathsEnum.collection}/${collections[0].id}`}>
                                    Избранное
                                </NavLink>
                                <LinkButton onClick={logoutHandler}>Выйти</LinkButton>
                            </>
                        )}
                        {!isAuthenticated && <LinkButton onClick={openModal}>Войти</LinkButton>}
                    </NavBar>
                </Header>

                <ContentWrapper>
                    <Outlet />
                </ContentWrapper>

                <Footer>
                    <FooterLink href="https://github.com/kurakinasv" target="_blank">
                        Link to Github
                    </FooterLink>
                </Footer>
            </Container>

            <Modal
                open={open}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={modalBoxStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {isRegistered ? 'Вход' : 'Регистрация'}
                        </Typography>
                        <Input
                            fullWidth={true}
                            name="email"
                            onChange={handleChange}
                            placeholder="Почта"
                            required={true}
                            type="text"
                            value={value.email}
                            sx={{ mt: 4 }}
                        />
                        <Input
                            fullWidth={true}
                            name="password"
                            onChange={handleChange}
                            placeholder="Пароль"
                            required={true}
                            type="password"
                            value={value.password}
                            sx={{ mt: 2 }}
                        />
                        <div>
                            <Button onClick={handleLogin} sx={{ mt: 4 }} variant="contained">
                                {isRegistered ? 'Войти' : 'Зарегистрироваться'}
                            </Button>
                        </div>
                        <Button variant="text" sx={{ mt: 1 }} size="small" onClick={toggleForm}>
                            {isRegistered ? 'Еще не зарегистрированы?' : 'Уже есть аккаунт?'}
                        </Button>
                    </Box>
                </>
            </Modal>
        </>
    );
};

export default observer(MainPage);
