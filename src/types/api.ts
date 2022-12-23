export type RefType = {
    authorId?: number;
    categoryId: number;
    createdAt: string;
    date_upload?: string;
    id: number;
    name: string;
    source: string;
    updatedAt: string;
};

// export type ImageType = {
//     id: number;
//     name: string;
//     date_upload: string;
//     source: string;
//     createdAt: string;
//     updatedAt: string;
//     categoryId: number;
//     authorId: number;
// };

export type AuthorType = {
    id: number;
    nickname: string;
    name?: string;
    surname?: string;
    social_media?: string;
};
