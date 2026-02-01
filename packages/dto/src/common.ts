import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';

export class PaginationMeta {
    @ApiProperty({ example: 1 })
    page!: number;

    @ApiProperty({ example: 20 })
    pageSize!: number;

    @ApiProperty({ example: 100 })
    total!: number;

    @ApiProperty({ example: 5 })
    totalPages!: number;

    @ApiPropertyOptional({ example: true })
    hasNext?: boolean;

    @ApiPropertyOptional({ example: false })
    hasPrev?: boolean;
}

export class ErrorInfo {
    @ApiProperty({ example: 'VALIDATION_ERROR' })
    code!: string;

    @ApiProperty({ example: 'Invalid input data' })
    message!: string;

    @ApiPropertyOptional({ type: [String] })
    details?: string[];
}

/**
 * Standardized API Response envelope.
 * All API endpoints should return this format.
 */
export class ApiResponseDto<T> {
    @ApiProperty({ example: true, description: 'Whether the request was successful' })
    success!: boolean;

    @ApiProperty({ example: 200, description: 'HTTP status code' })
    statusCode!: number;

    @ApiProperty({ example: '2026-01-31T19:50:00.000Z', description: 'ISO timestamp of response' })
    timestamp!: string;

    @ApiPropertyOptional({ description: 'Response payload' })
    data?: T;

    @ApiPropertyOptional({ type: () => PaginationMeta, description: 'Pagination metadata for list responses' })
    meta?: PaginationMeta;

    @ApiPropertyOptional({ type: () => ErrorInfo, description: 'Error details if success is false' })
    error?: ErrorInfo;
}

export class PaginationDto {
    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize?: number = 20;

    @ApiPropertyOptional({ description: 'Field to sort by' })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';

    get skip(): number {
        return ((this.page ?? 1) - 1) * (this.pageSize ?? 20);
    }

    get take(): number {
        return this.pageSize ?? 20;
    }
}

/**
 * Create a successful API response with standard envelope.
 * @param data - The response payload
 * @param statusCode - HTTP status code (default: 200)
 */
export function createSuccessResponse<T>(data: T, statusCode: number = 200): ApiResponseDto<T> {
    return {
        success: true,
        statusCode,
        timestamp: new Date().toISOString(),
        data,
    };
}

/**
 * Create a paginated API response with metadata.
 */
export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    statusCode: number = 200,
): ApiResponseDto<T[]> {
    const totalPages = Math.ceil(total / pageSize);
    return {
        success: true,
        statusCode,
        timestamp: new Date().toISOString(),
        data,
        meta: {
            page,
            pageSize,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}

/**
 * Create an error API response.
 * @param code - Error code (e.g., 'VALIDATION_ERROR')
 * @param message - Human-readable error message
 * @param statusCode - HTTP status code (default: 400)
 * @param details - Optional array of detailed error messages
 */
export function createErrorResponse(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: string[],
): ApiResponseDto<null> {
    return {
        success: false,
        statusCode,
        timestamp: new Date().toISOString(),
        error: { code, message, details },
    };
}
