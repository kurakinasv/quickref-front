import React, { FC } from 'react';

import { PathsEnum } from '@pages/Router';

import { CategoriesContainer, CategoryItem } from './Categories.styles';

const Categories: FC = () => {
    const categoryNames = [
        'Фигура человека',
        'Часть тела',
        'Животные',
        'Природа',
        'Архитектура',
        'Скульптура',
    ];

    return (
        <CategoriesContainer>
            {categoryNames.map((cat, i) => (
                <CategoryItem key={i + cat} to={PathsEnum.refs}>
                    {cat}
                </CategoryItem>
            ))}
        </CategoriesContainer>
    );
};

export default Categories;
