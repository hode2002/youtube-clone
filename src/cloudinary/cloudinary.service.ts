import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResourceType, CloudinaryResponse } from './cloudinary/cloudinary-response';
import * as streamifier from 'streamifier';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {}

    uploadFile(
        file: Express.Multer.File,
        customFolder: string = '',
        resource_type: CloudinaryResourceType = 'image',
    ): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const folderName = this.configService.get('CLOUDINARY_FOLDER_NAME') + customFolder;
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folderName,
                    resource_type,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve({
                        ...result,
                        originalname: file.originalname,
                    });
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    deleteFile(filePath: string, resource_type: CloudinaryResourceType = 'image') {
        const folderName = this.configService.get('CLOUDINARY_FOLDER_NAME');
        const arr = filePath.split(folderName);
        const ext = filePath.split('.').pop();
        const displayName = arr[arr.length - 1].split('.' + ext)[0];
        const publicId = folderName + displayName;
        return new Promise<any>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }
}
