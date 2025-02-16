import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { GoogleProfile, JwtPayload } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private ACCESS_TOKEN_SECRET = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    private ACCESS_TOKEN_EXPIRES_IN = this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN');
    private REFRESH_TOKEN_SECRET = this.configService.get<string>('REFRESH_TOKEN_SECRET');
    private REFRESH_TOKEN_EXPIRES_IN = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN');
    private FRONTEND_REDIRECT_URL = this.configService.get<string>('FRONTEND_REDIRECT_URL');

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async refreshAccessToken(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh_token'];

        const decoded = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as JwtPayload;
        const { email, role, userId } = decoded;

        const user = await this.userService.findByEmail(email);
        const storedHashedToken = user.hashedRefreshToken;

        const isValid = await bcrypt.compare(refreshToken, storedHashedToken);
        if (!isValid) throw new UnauthorizedException('Invalid refresh token');

        const expiresIn = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiresIn - now;

        if (timeLeft < 7 * 24 * 60 * 60 * 1000) {
            const newRefreshToken = this.jwtService.sign(
                { email, role, userId },
                {
                    secret: this.REFRESH_TOKEN_SECRET,
                    expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
                },
            );

            const refreshTokenHashed = await bcrypt.hash(newRefreshToken, 10);
            await this.userService.updateByEmail(email, { refreshTokenHashed });

            this.saveTokenToCookie(res, 'refresh_token', newRefreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
        }

        const newAccessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.ACCESS_TOKEN_SECRET,
                expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            },
        );

        return { newAccessToken };
    }

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
            hashedRefreshToken,
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Failed to update user with refresh token');
        }

        this.saveTokenToCookie(res, 'refresh_token', tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const redirectUrl = `${this.FRONTEND_REDIRECT_URL}/auth-success#token=${tokens.accessToken}`;
        return res.redirect(redirectUrl);
    }

    async logout(req: Request, res: Response) {
        const googleProfile = req['user'] as GoogleProfile;
        const user = await this.userService.create(googleProfile);
        const isUpdated = await this.userService.updateByEmail(user.email, {
            hashedRefreshToken: '',
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Failed to update user with refresh token');
        }

        this.saveTokenToCookie(res, 'refresh_token', '', {
            maxAge: 0,
        });

        return { loggedOut: true };
    }

    private saveTokenToCookie(res: Response, name: string, value: string, options?: CookieOptions) {
        res.cookie(name, value, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'None',
            path: '/',
            ...options,
        });
    }

    createTokenPairs({ email, role, userId }: JwtPayload) {
        const accessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.ACCESS_TOKEN_SECRET,
                expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            },
        );

        const refreshToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.REFRESH_TOKEN_SECRET,
                expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
            },
        );

        return { accessToken, refreshToken };
    }
}
