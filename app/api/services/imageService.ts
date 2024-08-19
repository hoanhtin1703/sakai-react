import { submitMultiForm } from './apiService';

interface ImageForResponse {
    id: string;
    fieldname: string;
    originalname: string;
    size: string;
    url: string;
    mimetype: string;
}

export type ImageForCard = {
    id?: string;
    field_name: string;
    original_name: string;
    size: string;
    url: string;
    mime_type: string;
};

export type ImageForPost = {
    image: any;
};

export async function uploadImageAboutUs(image: ImageForPost): Promise<ImageForCard | undefined> {
    const formData = new FormData();
    formData.append('image', image.image);
    const result = await submitMultiForm('/file/upload-image-about-us', formData);
    const data: ImageForResponse = result.response;
    if (result.status === 201) {
        return {
            field_name: data.fieldname,
            url: data.url,
            mime_type: data.mimetype,
            original_name: data.originalname,
            size: data.size
        };
    }
}

export async function uploadImageTrainingFields(image: ImageForPost): Promise<ImageForCard | undefined> {
    const formData = new FormData();
    formData.append('image', image.image);
    const result = await submitMultiForm('/file/upload-image-training-fields', formData);
    const data: ImageForResponse = result.response;
    if (result.status === 201) {
        return {
            id: data.id,
            field_name: data.fieldname,
            url: data.url,
            mime_type: data.mimetype,
            original_name: data.originalname,
            size: data.size
        };
    }
}

export async function uploadImageAdmission(image: ImageForPost): Promise<ImageForCard | undefined> {
    const formData = new FormData();
    formData.append('image', image.image);
    const result = await submitMultiForm('/file/upload-image-admission', formData);
    const data: ImageForResponse = result.response;
    if (result.status === 201) {
        return {
            id: data.id,
            field_name: data.fieldname,
            url: data.url,
            mime_type: data.mimetype,
            original_name: data.originalname,
            size: data.size
        };
    }
}