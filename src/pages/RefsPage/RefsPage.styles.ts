import styled from 'styled-components';

import { colors, rgbValues } from '@styles/colors';

const headerHeight = '70px';

export const Header = styled.header`
    width: 100%;
    height: ${headerHeight};

    position: sticky;
    top: 0;
    left: 0;

    padding: 16px 100px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: ${colors.lightPink};
`;

export const RightBlock = styled.div`
    display: flex;
    align-items: center;
`;

export const Logo = styled.div`
    font-weight: 300;
    font-size: 30px;
`;

export const Timer = styled.div`
    margin-right: 20px;
    font-size: 24px;
    color: ${colors.darkBrown};
`;

export const Content = styled.main`
    height: calc(100vh - ${headerHeight});
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const RefImage = styled.img`
    max-width: 90vw;
    max-height: calc(100vh - ${headerHeight});

    width: fit-content;
    height: fit-content;
`;

export const Footer = styled.footer`
    width: 100%;
    height: 120px;

    position: fixed;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: rgba(${rgbValues.pastelPeach}, 0.7);
`;
