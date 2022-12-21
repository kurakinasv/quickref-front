import styled from 'styled-components';

import { colors } from '@styles/colors';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
`;

export const PageTitle = styled.h1`
    font-weight: 400;
    font-size: 36px;
    text-align: center;
`;

export const ImageItem = styled.div<{ imgUrl: string }>`
    background-image: ${({ imgUrl }) => (imgUrl ? `url(${imgUrl})` : 'none')};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    border-radius: 8px;

    aspect-ratio: 2/3;
    object-fit: fill;

    cursor: pointer;
    user-select: none;
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
