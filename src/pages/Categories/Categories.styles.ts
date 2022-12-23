import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { colors } from '@styles/colors';

export const CategoriesContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

export const CategoryItem = styled(Link)`
    height: 34vh;

    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 33.3333%;

    font-weight: 400;
    font-size: 24px;
    color: ${colors.darkBrown};
    text-align: center;
    text-transform: uppercase;

    background-color: ${colors.lightPink};
    box-shadow: inset 0 0px 5px rgba(255, 191, 181, 0.4);
    transition: box-shadow 0.2s ease-in-out;

    :hover {
        box-shadow: inset 0 0px 30px rgba(255, 191, 181, 0.5);
        transition: box-shadow 0.2s ease-in-out;
    }

    cursor: pointer;
`;
