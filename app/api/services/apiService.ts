import { callDeleteRequestServer, callGetRequestServer, callPostRequestServer, callPutRequestServer, submitMultiFormServer } from './apiServerAcion';

export interface ApiResponse {
    status: number;
    headers: Headers;
    response: any;
}

export interface ApiErrorData {
    message: string;
}

export async function callGetRequest(url: string) {
    return await callGetRequestServer(url);
}

export async function submitMultiForm(url: string, formData: FormData) {
    return await submitMultiFormServer(url, formData);
}

export async function callPostRequest(url: string, body: any, p0?: { headers: { 'Content-Type': string; }; }) {
    return await callPostRequestServer(url, body);
}

export async function callPutRequest<Response, Request>(
    url: string,
    body: Request
): Promise<{
    status: number;
    headers: Headers;
    response: Response;
}> {
    return await callPutRequestServer(url, body);
}

export async function callDeleteRequest(url: string) {
    return await callDeleteRequestServer(url);
}
