import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { colors } from '@styles/colors';

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
