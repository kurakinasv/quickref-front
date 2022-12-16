import React, { FC } from 'react';

import { categoryNames } from '@config/categories';
import { PathsEnum } from '@pages/Router';

import { CategoriesContainer, CategoryItem } from './Categories.styles';

const Categories: FC = () => {
    return (
        <CategoriesContainer>
            {Object.values(categoryNames).map((cat, i) => (
                <CategoryItem key={i + cat} to={PathsEnum.refs}>
                    {cat}
                </CategoryItem>
            ))}
        </CategoriesContainer>
    );
};

export default Categories;
