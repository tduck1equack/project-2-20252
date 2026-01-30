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

export class ApiResponseDto<T> {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiPropertyOptional()
    data?: T;

    @ApiPropertyOptional({ type: () => PaginationMeta })
    meta?: PaginationMeta;

    @ApiPropertyOptional({ type: () => ErrorInfo })
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

export function createSuccessResponse<T>(data: T): ApiResponseDto<T> {
    return { success: true, data };
}

export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
): ApiResponseDto<T[]> {
    const totalPages = Math.ceil(total / pageSize);
    return {
        success: true,
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

export function createErrorResponse(
    code: string,
    message: string,
    details?: string[],
): ApiResponseDto<null> {
    return {
        success: false,
        error: { code, message, details },
    };
}
