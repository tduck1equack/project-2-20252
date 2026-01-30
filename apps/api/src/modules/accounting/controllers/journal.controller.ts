import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JournalService } from '../services/journal.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('journal-entries')
export class JournalController {
    constructor(private readonly service: JournalService) { }

    @Post()
    create(@Request() req: any, @Body() dto: any) {
        return this.service.create(req.user.tenantId, req.user.userId, dto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAll(req.user.tenantId);
    }
}
