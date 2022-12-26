import styled, { css } from 'styled-components';

import { Button, InputLabel } from '@mui/material';
import { colors, rgbValues } from '@styles/colors';

import { styled as muiStyled } from '@mui/material/styles';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;

    // to rise a little small sized label
    .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
        transform: translate(14px, 9px) scale(1);
    }
`;

export const PageTitle = styled.h1`
    font-weight: 400;
    font-size: 36px;
    text-align: center;
`;

export const Form = styled.div`
    width: 65vw;
    display: flex;
    gap: 70px;
`;

export const UploadImage = styled.div<{ isUpload: boolean }>`
    width: 500px;
    height: 470px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 4px dashed ${colors.peach};
    border-radius: 16px;

    cursor: pointer;

    ${({ isUpload }) =>
        isUpload &&
        css`
            border: 4px solid ${colors.peach};
            background-color: rgba(${rgbValues.peach}, 0.2);

            &,
            & > label {
                cursor: default;
            }
        `}

    & input {
        display: none;
    }
`;

export const StyledInputLabel = muiStyled(InputLabel)({
    width: '100%',
    height: '100%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    cursor: 'pointer',

    '& > svg': {
        width: '5em',
        height: '5em',
        fill: colors.peach,
    },
});

export const InfoPanel = styled.div`
    width: calc(80vw - 375px - 70px);
    min-width: 360px;
`;

export const InfoPanelItem = styled.div`
    margin-bottom: 35px;
    display: flex;
    gap: 20px;
    flex-direction: column;
`;

export const SubTitle = styled.div`
    font-size: 20px;
    font-weight: 500;
`;

export const StyledButton = muiStyled(Button)({
    width: '420px',
    backgroundColor: colors.darkBrown,

    '&:hover': {
        backgroundColor: colors.darkBrown,
    },
});
