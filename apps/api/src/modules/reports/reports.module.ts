import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { FinancialReportService } from './financial.service';

@Module({
  imports: [InfrastructureModule],
  controllers: [ReportsController],
  providers: [ReportsService, FinancialReportService],
})
export class ReportsModule {}
