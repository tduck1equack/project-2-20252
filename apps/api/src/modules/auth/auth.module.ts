import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@repo/config';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../providers/prisma.service';
import { RedisModule, TokenBlacklistService } from '../../redis';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        PassportModule,
        RedisModule,
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
    ],
    exports: [AuthService, RolesGuard],
})
export class AuthModule { }
