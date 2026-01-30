import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MovementService } from './movement.service';
import { CreateStockMovementUseCase } from '../use-cases/create-stock-movement.use-case';
import { CreateStockMovementDto, StockMovementDto, ApiResponseDto, createSuccessResponse } from '@repo/dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory: Movements')
@Controller('movements')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockMovementController {
    constructor(
        private readonly movementService: MovementService,
        private readonly createMovementUseCase: CreateStockMovementUseCase
    ) { }

    @Post()
    @Roles('EMPLOYEE', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'Create a stock movement' })
    async create(@Request() req: any, @Body() dto: CreateStockMovementDto): Promise<ApiResponseDto<StockMovementDto>> {
        // Use the new Use Case
        const movement = await this.createMovementUseCase.execute(req.user.tenantId, req.user.id, dto);
        return createSuccessResponse(movement as unknown as StockMovementDto);
    }

    @Get()
    @Roles('EMPLOYEE', 'MANAGER', 'ADMIN')
    @ApiOperation({ summary: 'List movements history' })
    async findAll(@Request() req: any): Promise<ApiResponseDto<StockMovementDto[]>> {
        // Keep using Service for read-path (until refactored)
        const movements = await this.movementService.findAll(req.user.tenantId);
        return createSuccessResponse(movements);
    }
}
