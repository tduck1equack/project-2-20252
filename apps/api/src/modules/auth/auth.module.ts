import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@repo/config';
import { AuthController } from './auth.controller';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { TokenBlacklistService } from '../infrastructure/redis/token-blacklist.service';
import { RolesGuard } from './guards/roles.guard';
import { WsAuthGuard } from './guards/ws-auth.guard';

@Module({
    imports: [
        PassportModule,
        ConfigModule, // For ConfigService in WsAuthGuard
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
        PrismaService,
        TokenBlacklistService,
        RolesGuard,
        WsAuthGuard, // Register as provider
    ],
    exports: [AuthService, RolesGuard, WsAuthGuard, JwtModule], // Export JwtModule for JwtService access
})
export class AuthModule { }

