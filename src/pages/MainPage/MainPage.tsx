import React, { useState } from 'react';

import {
    CategoriesContainer,
    CategoryItem,
    Container,
    ContentWrapper,
    Footer,
    FooterLink,
    Header,
    Logo,
    NavBar,
    NavLink,
} from './MainPage.styles';

const MainPage = () => {
    const [isAuth, setIsAuth] = useState(false);

    const categoryNames = [
        'Фигура человека',
        'Часть тела',
        'Животные',
        'Природа',
        'Архитектура',
        'Скульптура',
    ];

    return (
        <Container>
            <Header>
                <Logo>QuickRef</Logo>
                <NavBar>
                    {isAuth && (
                        <>
                            <NavLink>
                                <a href="#">Профиль</a>
                            </NavLink>
                            <NavLink>
                                <a href="#">Выйти</a>
                            </NavLink>
                        </>
                    )}
                    {!isAuth && (
                        <NavLink>
                            <a href="#">Войти</a>
                        </NavLink>
                    )}
                </NavBar>
            </Header>

            <ContentWrapper>
                <CategoriesContainer>
                    {categoryNames.map((cat, i) => (
                        <CategoryItem key={i + cat}>{cat}</CategoryItem>
                    ))}
                </CategoriesContainer>
            </ContentWrapper>

            <Footer>
                <FooterLink href="https://github.com/kurakinasv" target="_blank">
                    Link to Github
                </FooterLink>
            </Footer>
        </Container>
    );
};

export default MainPage;
