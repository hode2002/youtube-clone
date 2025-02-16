import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { GoogleProfile, JwtPayload } from 'src/common/types';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { Request } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() googleProfile: GoogleProfile) {
        return this.userService.create(googleProfile);
    }

    @Get('/profile')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Get user profile successfully')
    getProfile(@Req() req: Request) {
        const { email } = req['user'] as JwtPayload;
        return this.userService.findByEmail(email);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}
