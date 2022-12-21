import styled from 'styled-components';

import { Button } from '@mui/material';
import { colors } from '@styles/colors';

import { styled as muiStyled } from '@mui/material/styles';

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

export const StyledButton = muiStyled(Button)({
    backgroundColor: colors.darkBrown,

    '&:hover': {
        backgroundColor: colors.darkBrown,
    },
});
