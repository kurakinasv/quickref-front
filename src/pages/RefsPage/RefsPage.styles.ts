import styled, { css } from 'styled-components';

import { FormControl } from '@mui/material';
import { colors, rgbValues } from '@styles/colors';

import { styled as muiStyled } from '@mui/material/styles';

const headerHeight = '70px';
const footerHeight = '120px';

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
    height: calc(100vh - ${headerHeight} - ${footerHeight});
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const RefImage = styled.img`
    max-width: 90vw;
    max-height: calc(100vh - ${headerHeight} - ${footerHeight});

    width: fit-content;
    height: fit-content;

    user-select: none;
`;

export const Footer = styled.footer`
    width: 100%;
    height: ${footerHeight};
    padding: 0 30vw;

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
    word-break: break-all;
`;

export const StyledFormControl = muiStyled(FormControl)({
    // to rise a little small sized label
    '.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': {
        transform: 'translate(14px, 9px) scale(1)',
    },
});

export const ImageBlock = styled.div`
    width: 100%;
    margin: 20px 0;

    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
`;

export const ImageButton = styled.div<{ imgUrl: string; isActive: boolean }>`
    max-height: 200px;
    flex-basis: 23%;
    margin: 0 10px;

    background-image: ${({ imgUrl }) => (imgUrl ? `url(${imgUrl})` : 'none')};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 8px;

    aspect-ratio: 2/3;
    object-fit: fill;

    cursor: pointer;

    border: ${({ isActive }) => (isActive ? `4px dashed ${colors.peach}` : 'none')};

    &:nth-child(4n) {
        margin-right: 0px;
    }

    &:nth-child(4n + 1) {
        margin-left: 0px;
    }
`;

export const ButtonsBlock = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 20px;
`;
