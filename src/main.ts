import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationError } from 'class-validator';
import { HttpExceptionFilter } from 'src/common/filters';
import { TransformInterceptor } from 'src/common/interceptors';

const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions: CorsOptions = {
    origin: (origin: string, callback: (error: ForbiddenException, isAllow?: boolean) => void) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new ForbiddenException('Origin not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors(corsOptions);
    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            exceptionFactory: (validationErrors: ValidationError[]) => {
                const errors = validationErrors.map((error) => ({
                    property: error.property,
                    error: Object.values(error.constraints)[0],
                }));
                return new BadRequestException(errors);
            },
        }),
    );

    app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('/api/v1', {
        exclude: ['/'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    await app.listen(port || 3001);
}
bootstrap();
