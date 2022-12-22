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

export type AuthorType = {
    nickname: string;
    name?: string;
    surname?: string;
    social_media?: string;
};
