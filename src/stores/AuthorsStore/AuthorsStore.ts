import { makeAutoObservable } from 'mobx';

import { headers } from '@config/api';
import endpoints from '@config/endpoints';
import RootStore from '@stores/RootStore';
import { AuthorType } from '@typings/api';
import { formUrl } from '@utils/formUrl';

type PrivateFields = 'rootStore';

class AuthorsStore {
    private rootStore: RootStore;

    private _author: AuthorType | null = null;
    private _authors: AuthorType[] = [];

    constructor(rootStore: RootStore) {
        makeAutoObservable<this, PrivateFields>(this);
        this.rootStore = rootStore;
    }

    get author() {
        return this._author;
    }

    get authors() {
        return this._authors;
    }

    get token() {
        return this.rootStore.authStore.token;
    }

    setAuthor = (author: AuthorType | null) => {
        this._author = author;
    };

    setAllAuthors = (authors: AuthorType[]) => {
        this._authors = authors;
    };

    getAuthors = async (id?: number) => {
        const url = formUrl(endpoints.getAuthors.url);

        try {
            const response = await fetch(`${url}${id || ''}`, {
                method: endpoints.getAuthors.method,
                headers,
            });
            const data = await response.json();

            if (data) {
                if (id) {
                    this.setAuthor(data);
                } else {
                    this.setAllAuthors(data);
                }
            }
        } catch (err: any) {
            this.rootStore.meta.setIsError(true);
            throw Error(`getAuthors: ${err.message}`);
        }
    };

    findAuthorByNickName = async (nick: string) => {
        await this.getAuthors();

        const found = this.authors.find((author) => author.nickname === nick);

        if (!found) {
            this.rootStore.meta.setIsError(true);
            throw new Error('Автор по заданному никнейму не найден');
        }

        return found;
    };
}

export default AuthorsStore;
