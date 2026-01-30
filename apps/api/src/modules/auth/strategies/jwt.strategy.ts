import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from '@repo/config';
import { TokenBlacklistService } from '../../../redis/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private tokenBlacklist: TokenBlacklistService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        // Check if token is blacklisted
        if (payload.jti && await this.tokenBlacklist.isBlacklisted(payload.jti)) {
            throw new UnauthorizedException('Token has been revoked');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            tenantId: payload.tenantId,
            jti: payload.jti,
        };
    }
}
