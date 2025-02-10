import { Controller, Get, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/auth/guards';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(GoogleGuard)
    async googleLogin() {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Redirect to google login',
        };
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Login successfully',
            data: await this.authService.login(req, res),
        };
    }
}
