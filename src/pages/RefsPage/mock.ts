import refs, { RefsType } from '@img/refs';

export const refsInfo: Record<keyof RefsType, { id: string; author: string; source: string }> = {
    [refs.camp]: {
        id: '1',
        author: 'camp author',
        source: 'http://campsource.com',
    },
    [refs.ThumbUpX]: {
        id: 'ThumbUpX',
        author: 'ThumbUpX author',
        source: 'http://ThumbUpXsource.com',
    },
    [refs.cat1]: {
        id: 'cat1',
        author: 'cat1 author',
        source: 'http://cat1source.com',
    },
    [refs.cat2]: {
        id: 'cat2',
        author: 'cat2 author',
        source: 'http://cat2source.com',
    },
    [refs.cat3]: {
        id: 'cat3',
        author: 'cat3 author',
        source: 'http://cat3source.com',
    },
    [refs.cat4]: {
        id: 'cat4',
        author: 'cat4 author',
        source: 'http://cat4source.com',
    },
    [refs.pepeChill]: {
        id: 'pepeChill',
        author: 'pepeChill author',
        source: 'http://pepeChillsource.com',
    },
    [refs.tucked]: {
        id: 'tucked',
        author: 'tucked author',
        source: 'http://tuckedsource.com',
    },
};

export const collections = [
    { id: 'favs', name: 'favourites' },
    { id: '1', name: 'col1' },
    { id: '2', name: 'col2' },
    { id: '3', name: 'col3' },
];
