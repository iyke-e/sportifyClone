import { isTokenValid, getStoredToken } from './tokenUtils';

export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {},
    logout?: () => Promise<void>
): Promise<Response> => {
    const valid = await isTokenValid();

    if (!valid && logout) {
        await logout();
        throw new Error('Token expired. Logged out.');
    }

    const token = await getStoredToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401 && logout) {
        await logout();
        throw new Error('Unauthorized — token may be invalid or expired.');
    }

    return response; // ❗ Return raw Response instead of calling .json()
};
