import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtJwtStrategy, RfJwtStrategy } from 'src/auth/strategy';
import { GoogleStrategy } from 'src/auth/strategy/google.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [PassportModule, JwtModule.register({}), UserModule],
    controllers: [AuthController],
    providers: [AuthService, AtJwtStrategy, RfJwtStrategy, GoogleStrategy],
})
export class AuthModule {}
