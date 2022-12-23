export type UserType = {
    id: number;
    email: string | undefined;
    password: string;
    isAdmin: boolean;
    name?: string;
    surname?: string;
    username?: string | undefined;
    about?: string;
    createdAt: string;
};

export type InputType = 'name' | 'surname' | 'email' | 'username';

export type UserInfoType = Pick<UserType, InputType>;

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
    id: number;
    nickname: string;
    name?: string;
    surname?: string;
    social_media?: string;
};

export type CategoryType = {
    id: number;
    category_name: string;
    category_description?: string;
    updatedAt: string;
    createdAt: string;
};

export type ImageCollectionType = {
    collectionId: number;
    createdAt: string;
    imageId: number;
    updatedAt: string;
};
