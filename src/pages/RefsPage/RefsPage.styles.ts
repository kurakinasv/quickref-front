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
    user-select: none;
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

    user-select: none;
`;

export const Footer = styled.footer`
    width: 100%;
    height: 120px;
    padding: 0 10vw;

    position: fixed;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: rgba(${rgbValues.pastelPeach}, 0.7);

    svg {
        font-size: 5rem;
        fill: ${colors.dirtyPeach};
    }
`;

export const ModalTitle = styled.div`
    font-size: 24px;
    color: ${colors.black};
    font-weight: 500;
    margin-bottom: 40px;
    user-select: none;
    cursor: default;
`;

export const InfoItem = styled.div`
    margin-top: 20px;
`;

export const ItemTitle = styled.span`
    padding-right: 30px;

    font-size: 24px;
    color: ${colors.black};

    opacity: 0.5;
    transition: opacity 0.2s ease-in;
    user-select: none;
    cursor: default;

    :hover {
        opacity: 1;
    }
`;

export const ItemData = styled.span`
    font-size: 24px;
    color: ${colors.darkBrown};
    font-weight: 500;
`;
