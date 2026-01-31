import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule { }
