import { cookies } from 'next/headers';

export function setCookie(key: string, value: string) {
    const cookieStore = cookies();
    cookieStore.set(key, value);
}

export function getCookie(key: string) {
    const cookieStore = cookies();
    return cookieStore.get(key);
}

export function deleteCookie(key: string) {
    const cookieStore = cookies();
    cookieStore.delete(key);
}
