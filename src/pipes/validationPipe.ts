import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';

export class ValidationPipe implements PipeTransform {
    constructor(private readonly schema: Schema) {}
    transform(value: any) {
        const val = this.schema.safeParse(value);
        if (val.success) return val.data;
        throw new BadRequestException(val.error.format());
    }
}
