import { Controller, Get, Req, Res, UseGuards, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AtJwtGuard, GoogleGuard } from 'src/auth/guards';
import { Request, Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/message.decorator';

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

    @Post('logout')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Logout successfully')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return await this.authService.logout(req, res);
    }
}
