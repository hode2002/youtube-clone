import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
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

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async refreshAccessToken(refreshToken: string) {
        const decoded = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as JwtPayload;
        const { email, role, userId } = decoded;

        const user = await this.userService.findByEmail(email);
        const storedHashedToken = user.hashedRefreshToken;

        const isValid = await bcrypt.compare(refreshToken, storedHashedToken);
        if (!isValid) throw new UnauthorizedException('Invalid refresh token');

        const expiresIn = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expiresIn - now;

        let newRefreshToken = refreshToken;
        let refreshTokenUpdated = false;

        if (timeLeft < 7 * 24 * 60 * 60 * 1000) {
            newRefreshToken = this.jwtService.sign(
                { email, role, userId },
                {
                    secret: this.REFRESH_TOKEN_SECRET,
                    expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
                },
            );
            refreshTokenUpdated = true;
            const refreshTokenHashed = await bcrypt.hash(newRefreshToken, 10);
            await this.userService.updateByEmail(email, { refreshTokenHashed });
        }

        const newAccessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.ACCESS_TOKEN_SECRET,
                expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
            },
        );

        return { newAccessToken, newRefreshToken, refreshTokenUpdated };
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
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const redirectUrl = `${this.configService.get<string>('FRONTEND_REDIRECT_URL')}/auth-success#token=${tokens.accessToken}`;
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

        res.cookie('refresh_token', '', {
            httpOnly: true,
            // secure: true,
            // sameSite: 'strict',
            maxAge: 0,
        });

        return { loggedOut: true };
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
