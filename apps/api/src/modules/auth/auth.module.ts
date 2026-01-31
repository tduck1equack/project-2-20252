import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@repo/config';
import { AuthController } from './auth.controller';
import { TokenBlacklistService } from '../infrastructure/redis/token-blacklist.service';
import { RolesGuard } from './guards/roles.guard';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        InfrastructureModule, // For PrismaService
        JwtModule.register({
            secret: env.JWT_SECRET,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        TokenBlacklistService,
        RolesGuard,
        WsAuthGuard,
        // Repositories
        UserRepository,
        RefreshTokenRepository,
    ],
    exports: [AuthService, RolesGuard, WsAuthGuard, JwtModule],
})
export class AuthModule { }
