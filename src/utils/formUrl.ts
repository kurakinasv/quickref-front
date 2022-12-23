import { BASE_URL } from '@config/api';

export const formUrl = (endpoint: string) => {
    return BASE_URL + 'api' + endpoint;
};
