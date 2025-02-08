import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { GoogleProfile, JwtPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login(req: Request, res: Response) {
        const googleProfile = req['user'] as GoogleProfile;

        const user = await this.userService.create(googleProfile);
        const tokens = this.createTokenPairs({
            email: googleProfile.email,
            role: user.role,
            userId: String(user._id),
        });

        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        const isUpdated = await this.userService.updateByEmail(googleProfile.email, {
            refreshToken: hashedRefreshToken,
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Failed to update user with refresh token');
        }

        const redirectUrl = `${this.configService.get<string>('FRONTEND_REDIRECT_URL')}?atToken=${tokens.accessToken}&rfToken=${tokens.refreshToken}`;
        return res.redirect(redirectUrl);
    }

    createTokenPairs({ email, role, userId }: JwtPayload) {
        const accessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
            },
        );

        const refreshToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        return { accessToken, refreshToken };
    }
}
