import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { PathsEnum } from '@pages/Router';
import { useAuthStore } from '@stores/AuthStore';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const MainPage = () => {
    const { isAuthenticated, isAdmin, loginHandler, registerHandler, logoutHandler } =
        useAuthStore();

    const [isRegistered, setIsRegistered] = useState(true);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = useState({ email: '', password: '' });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue((val) => ({ ...val, [name]: value }));
    };

    const handleLogin = () => {
        const { email, password } = value;
        isRegistered ? loginHandler(email, password) : registerHandler(email, password);
        handleClose();
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
                                <NavLink to={PathsEnum.profile}>Профиль</NavLink>
                                {isAdmin && <NavLink to={PathsEnum.admin}>Админ-панель</NavLink>}
                                <LinkButton onClick={logoutHandler}>Выйти</LinkButton>
                            </>
                        )}
                        {!isAuthenticated && <LinkButton onClick={handleOpen}>Войти</LinkButton>}
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
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>
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
