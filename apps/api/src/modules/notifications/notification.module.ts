import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { env } from '@repo/config';
import { NotificationProcessor } from './notification.processor';
import { NotificationListener } from './notification.listener';
import { EmailService } from './email.service';
import { NotificationGateway } from './notification.gateway';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
            },
        }),
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    providers: [
        EmailService,
        NotificationGateway,
        NotificationProcessor,
        NotificationListener,
    ],
    exports: [EmailService, NotificationGateway],
})
export class NotificationModule { }
