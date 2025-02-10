import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { GoogleProfile } from 'src/common/types';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() googleProfile: GoogleProfile) {
        return this.userService.create(googleProfile);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}
