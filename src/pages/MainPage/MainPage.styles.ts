import { Link } from 'react-router-dom';

import styled, { css } from 'styled-components';

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

    z-index: 10;
`;

export const Logo = styled(Link)`
    font-weight: 300;
    font-size: 40px;
    user-select: none;
`;

export const NavBar = styled.nav`
    display: flex;
    gap: 30px;
`;

export const NavLink = styled(Link)<{ isActive: boolean }>`
    position: relative;

    color: ${colors.darkBrown};
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;

    :hover {
        text-decoration: underline;
        cursor: pointer;
    }

    ${({ isActive }) =>
        isActive &&
        css`
            border-bottom: 2px solid ${colors.darkBrown};

            :hover {
                text-decoration: none;
                cursor: default;
            }
            &::after {
                display: block;
            }
        `}

    &::after {
        content: '';
        display: none;

        width: auto;
        height: 2px;

        background-color: ${colors.darkBrown};
    }
`;

export const LinkButton = styled.button`
    color: ${colors.darkBrown};
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;

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
