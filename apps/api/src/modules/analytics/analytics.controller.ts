import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@repo/database';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('admin')
    @Roles(Role.ADMIN)
    async getAdminStats() {
        return this.analyticsService.getAdminStats();
    }

    @Get('manager')
    @Roles(Role.MANAGER, Role.ADMIN) // Admin can see manager stats too? Or maybe just Manager
    async getManagerStats(@Request() req: any) {
        // Admin might not have tenantId if Global? 
        // Assuming Manager has tenantId.
        const tenantId = req.user.tenantId;
        if (!tenantId) return { message: 'No Tenant Context' };
        return this.analyticsService.getManagerStats(tenantId);
    }

    @Get('employee')
    @Roles(Role.EMPLOYEE, Role.MANAGER, Role.ADMIN)
    async getEmployeeStats(@Request() req: any) {
        return this.analyticsService.getEmployeeStats(req.user.id);
    }
}
