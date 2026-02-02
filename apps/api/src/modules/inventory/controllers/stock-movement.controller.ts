import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StockMovementService } from '../services/stock-movement.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock-movements')
export class StockMovementController {
  constructor(private readonly service: StockMovementService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new stock movement (receipt, issue, transfer)',
  })
  async create(
    @Request() req: any,
    @Body() dto: any,
  ): Promise<ApiResponseDto<any>> {
    const movement = await this.service.create(
      req.user.tenantId,
      req.user.userId,
      dto,
    );
    return createSuccessResponse(movement, 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock movements' })
  async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
    const movements = await this.service.findAll(req.user.tenantId);
    return createSuccessResponse(movements);
  }
}
