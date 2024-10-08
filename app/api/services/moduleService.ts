
import { callGetRequest, callPostRequest } from './apiService';

export async function importDanhMucHocPhan(file: File): Promise<{ fileKey: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('http://127.0.0.1:8000/import-danh-muc-hoc-phan', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status}, ${errorText}`);
            throw new Error('Failed to import file');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    }
}


export async function getDanhMucHocPhan(fileKey: string): Promise<any> {
    const result = await callGetRequest(`danh-muc-hoc-phan/${fileKey}`);

    if (result.status === 200) {
        return result.response;
    } else {
        console.error(`Error: ${result.status}`);
    }
}


export async function getHocPhan(fileKey: string, hocPhan: string): Promise<any> {
    const result = await callGetRequest(`${fileKey}/${hocPhan}`);

    if (result.status === 200) {
        return result.response;
    } else {
        console.error(`Error: ${result.status}`);
    }
}

export async function getDanhSachSinhVien(fileKey: string, lopHocPhan: string): Promise<any> {
    const result = await callGetRequest(`${fileKey}/${lopHocPhan}/danh-sach-sinh-vien`);

    if (result.status === 200) {
        return result.response;
    } else {
        console.error(`Error: ${result.status}`);
    }
}

export interface KhoaSinhVien {
    Khoa: string;
    Hoc_ky: string;
    Nam_hoc: string;
    Url_hoc_phan: string;
}

export async function getKhoaSinhVien(): Promise< {data: KhoaSinhVien[] }| null> {
    try {
        const response = await callGetRequest(`loc-ten-file`);

        if (response.status === 200) {
            // Assuming response.response contains an array of KhoaSinhVien data
            return response.response as { data: KhoaSinhVien[] }
        } else {
            console.error(`Error: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

