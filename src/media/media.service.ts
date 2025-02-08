import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
    CloudinaryResourceType,
    CloudinaryResponse,
} from 'src/cloudinary/cloudinary/cloudinary-response';

@Injectable()
export class MediaService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly configService: ConfigService,
    ) {}

    async upload(
        file: Express.Multer.File,
        folder?: string,
        type: CloudinaryResourceType = 'image',
    ): Promise<CloudinaryResponse> {
        if (!file) throw new BadRequestException('Missing file');
        return await this.cloudinaryService.uploadFile(file, folder, type);
    }

    async delete(filePath: string) {
        const cloudinaryName = this.configService.get('CLOUDINARY_NAME');
        const resourceType = filePath
            .split('/upload')[0]
            .split(cloudinaryName + '/')[1] as CloudinaryResourceType;
        return await this.cloudinaryService.deleteFile(filePath, resourceType);
    }
}
