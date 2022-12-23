export const getAuthHeader = (token: string | null) => ({
    Authorization: `Bearer ${token}`,
});
