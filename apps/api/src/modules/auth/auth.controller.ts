import { Controller, Request, Post, UseGuards, Body, Get, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards/auth.guard';

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'admin@example.com' },
                password: { type: 'string', example: 'password123' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Returns access token, refresh token set in cookie' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(req.user);

        // Set refresh token as HttpOnly cookie
        res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/auth', // Only sent to auth endpoints
        });

        return {
            accessToken: tokens.accessToken,
            expiresIn: tokens.expiresIn,
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
    @ApiCookieAuth('refresh_token')
    @ApiResponse({ status: 200, description: 'Returns new access token' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const oldRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

        if (!oldRefreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const tokens = await this.authService.refresh(oldRefreshToken);

        // Set new refresh token (sliding window)
        res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/auth',
        });

        return {
            accessToken: tokens.accessToken,
            expiresIn: tokens.expiresIn,
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout and invalidate tokens' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const accessToken = req.headers.authorization?.replace('Bearer ', '');
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

        await this.authService.logout(accessToken, refreshToken);

        // Clear refresh token cookie
        res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/auth' });

        return { message: 'Successfully logged out' };
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
                name: { type: 'string', example: 'John Doe' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    async register(@Body() body: any) {
        const user = await this.authService.register(body);
        const { password, ...result } = user;
        return result;
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Request() req: any) {
        return req.user;
    }
}
