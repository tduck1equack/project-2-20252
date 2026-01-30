import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/auth.guard';

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
    @ApiResponse({ status: 200, description: 'Returns JWT access token' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Request() req: any) {
        return this.authService.login(req.user);
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
        return this.authService.register(body);
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
