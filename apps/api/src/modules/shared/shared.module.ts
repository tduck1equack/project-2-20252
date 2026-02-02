import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { UtilityService } from './services/utility.service';

@Global()
@Module({
  providers: [LoggerService, UtilityService],
  exports: [LoggerService, UtilityService],
})
export class SharedModule {}
