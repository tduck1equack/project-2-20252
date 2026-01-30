import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@repo/config';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../providers/prisma.service';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: env.JWT_SECRET,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
    exports: [AuthService],
})
export class AuthModule { }
