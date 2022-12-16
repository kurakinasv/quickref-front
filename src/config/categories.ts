export enum CategoriesEnum {
    figure = 'figure',
    bodyPart = 'bodyPart',
    animals = 'animals',
    nature = 'nature',
    architecture = 'architecture',
    sculpture = 'sculpture',
}

export const categoryNames = {
    [CategoriesEnum.figure]: 'Фигура человека',
    [CategoriesEnum.bodyPart]: 'Часть тела',
    [CategoriesEnum.animals]: 'Животные',
    [CategoriesEnum.nature]: 'Природа',
    [CategoriesEnum.architecture]: 'Архитектура',
    [CategoriesEnum.sculpture]: 'Скульптура',
};

type CategoriesInfoType = Record<CategoriesEnum, { id: number; name: string }>;

export const categoriesInfo: CategoriesInfoType = Object.entries(categoryNames).reduce(
    (infoObj, [categoryKey, categoryName], i) => ({
        ...infoObj,
        [categoryKey]: { id: i, name: categoryName },
    }),
    {} as CategoriesInfoType
);
