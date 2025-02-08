import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
export type CloudinaryResourceType = 'image' | 'video' | 'auto' | 'raw';
