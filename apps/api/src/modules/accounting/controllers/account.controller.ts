import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { AccountType } from '@repo/database';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
    constructor(private readonly service: AccountService) { }

    @Post()
    create(@Request() req: any, @Body() dto: { code: string; name: string; type: AccountType; details?: string; parentId?: string }) {
        return this.service.create(req.user.tenantId, dto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAll(req.user.tenantId);
    }

    @Post('seed')
    seed(@Request() req: any) {
        return this.service.seed(req.user.tenantId);
    }
}
