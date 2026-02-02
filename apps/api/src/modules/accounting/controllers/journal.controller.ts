import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JournalService } from '../services/journal.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Accounting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('journal-entries')
export class JournalController {
  constructor(private readonly service: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a journal entry' })
  async create(
    @Request() req: any,
    @Body() dto: any,
  ): Promise<ApiResponseDto<any>> {
    const entry = await this.service.create(
      req.user.tenantId,
      req.user.userId,
      dto,
    );
    return createSuccessResponse(entry);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal entries' })
  async findAll(@Request() req: any): Promise<ApiResponseDto<any[]>> {
    const entries = await this.service.findAll(req.user.tenantId);
    return createSuccessResponse(entries);
  }
}
