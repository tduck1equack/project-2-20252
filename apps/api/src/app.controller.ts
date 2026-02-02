import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { createSuccessResponse, ApiResponseDto } from '@repo/dto';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHello(): ApiResponseDto<{ status: string; message: string }> {
    return createSuccessResponse({
      status: 'ok',
      message: this.appService.getHello(),
    });
  }
}
