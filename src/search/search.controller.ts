import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Search successfully')
    async search(@Query('q') query: string) {
        return await this.searchService.search(query);
    }
}
