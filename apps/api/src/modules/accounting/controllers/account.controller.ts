import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccountService } from '../services/account.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { AccountType } from '@repo/database';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Accounting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  async create(
    @Request() req: any,
    @Body()
    dto: {
      code: string;
      name: string;
      type: AccountType;
      details?: string;
      parentId?: string;
    },
  ): Promise<ApiResponseDto<any>> {
    const account = await this.service.create(req.user.tenantId, dto);
    return createSuccessResponse(account, 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
    const accounts = await this.service.findAll(req.user.tenantId);
    return createSuccessResponse(accounts);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed core chart of accounts' })
  async seed(
    @Request() req: any,
  ): Promise<ApiResponseDto<{ message: string }>> {
    await this.service.seed(req.user.tenantId);
    return createSuccessResponse(
      { message: 'Core accounts seeded successfully' },
      201,
    );
  }
}
