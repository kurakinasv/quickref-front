import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { colors } from '@styles/colors';

export const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header`
    width: 100%;
    height: 130px;

    position: sticky;
    top: 0;
    left: 0;

    padding: 36px 100px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: ${colors.lightPink};
`;

export const Logo = styled.div`
    font-weight: 300;
    font-size: 40px;
`;

export const NavBar = styled.nav`
    display: flex;
    gap: 30px;
`;

export const NavLink = styled(Link)`
    color: ${colors.darkBrown};
    font-size: 16px;
    font-weight: 500;

    :hover {
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const LinkButton = styled.button`
    color: ${colors.darkBrown};
    font-size: 16px;
    font-weight: 500;

    :hover {
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const ContentWrapper = styled.main`
    width: 90vw;

    margin: 0 auto;
    padding: 40px 0;

    flex: 1 1 auto;
`;

export const CategoriesContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

export const CategoryItem = styled(Link)`
    height: 30vh;

    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 33.3333%;

    font-weight: 500;
    font-size: 24px;
    color: ${colors.lightPink};
    text-align: center;
    text-transform: uppercase;

    border: 4px solid ${colors.dirtyPeach};
    background-color: ${colors.darkBrown};

    cursor: pointer;
`;

export const Footer = styled.footer`
    width: 100%;
    height: 96px;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${colors.pastelPeach};
`;

export const FooterLink = styled.a`
    font-size: 16px;
    font-weight: 500;
    color: ${colors.darkBrown};

    :hover {
        text-decoration: underline;
        cursor: pointer;
    }
`;
