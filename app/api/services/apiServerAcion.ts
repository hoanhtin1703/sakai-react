'use server';

import { cookies } from 'next/headers';
import { COOKIE_ACCESS_TOKEN_KEY } from '@/app/lib/constant';

const API_PATH = process.env.API_PRIVATE_URL;
const revalidateSeconds = Number(process.env.FETCH_CACHE_SECONDS);

export interface ApiResponse {
    status: number;
    headers: Headers;
    response: any;
}

export interface ApiErrorData {
    message: string;
}

export async function callGetRequestServer(url: string) {
    const cookieStore = cookies();
    const sessionKey = cookieStore.get(COOKIE_ACCESS_TOKEN_KEY);
    const res = await fetch(`${API_PATH}${url}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${sessionKey?.value}` },
        cache: 'no-cache'
    });
    const jo = await res.json();

    return { status: res.status, headers: res.headers, response: jo };
}

export async function submitMultiFormServer(url: string, formData: FormData) {
    const cookieStore = cookies();
    const sessionKey = cookieStore.get(COOKIE_ACCESS_TOKEN_KEY);
    const res = await fetch(`${API_PATH}${url}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionKey?.value}` },
        body: formData
    });
    const jo = await res.json();
    return { status: res.status, headers: res.headers, response: jo };
}

export async function callPostRequestServer(url: string, body: any) {
    const cookieStore = cookies();
    const sessionKey = cookieStore.get(COOKIE_ACCESS_TOKEN_KEY);
    const res = await fetch(`${API_PATH}${url}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${sessionKey?.value}`
        },
        body: JSON.stringify(body)
    });
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const jo = await res.json();
        return { status: res.status, headers: res.headers, response: jo };
    } else {
        return { status: res.status, headers: res.headers, response: null };
    }
}

export async function callPutRequestServer<Response, Request>(
    url: string,
    body: Request
): Promise<{
    status: number;
    headers: Headers;
    response: Response;
}> {
    const cookieStore = cookies();
    const sessionKey = cookieStore.get(COOKIE_ACCESS_TOKEN_KEY);
    const res = await fetch(`${API_PATH}${url}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${sessionKey?.value}`
        },
        body: JSON.stringify(body)
    });
    const jo = await res.json();
    return { status: res.status, headers: res.headers, response: jo };
}

export async function callDeleteRequestServer(url: string) {
    const cookieStore = cookies();
    const sessionKey = cookieStore.get(COOKIE_ACCESS_TOKEN_KEY);

    const res = await fetch(`${API_PATH}${url}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionKey?.value}`
        }
    });

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const jo = await res.json();
        return { status: res.status, headers: res.headers, response: jo };
    } else {
        // Trả về một đối tượng chỉ có trạng thái và tiêu đề
        return { status: res.status, headers: res.headers, response: null };
    }
}
