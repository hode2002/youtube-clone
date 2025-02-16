import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types';
import { Request } from 'express';

@Injectable()
export class RfJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    if (req.cookies && req.cookies['refresh_token']) {
                        return req.cookies['refresh_token'];
                    }
                    return null;
                },
            ]),
            secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
