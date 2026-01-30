import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Enums (Should match Prisma)
export enum MovementType {
    INBOUND = 'INBOUND',
    OUTBOUND = 'OUTBOUND',
    TRANSFER = 'TRANSFER',
    ADJUSTMENT = 'ADJUSTMENT'
}

export enum MovementStatus {
    DRAFT = 'DRAFT',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Warehouse
export class WarehouseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional()
    location?: string;
}

export class CreateWarehouseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    location?: string;
}

// Stock
export class StockLevelDto {
    @ApiProperty()
    warehouseId!: string;

    @ApiProperty()
    productVariantId!: string;

    @ApiProperty()
    productName!: string;

    @ApiProperty()
    variantName!: string;

    @ApiProperty()
    sku!: string;

    @ApiProperty()
    quantity!: number;
}

// Movements
export class CreateStockMovementItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productVariantId!: string;

    @ApiProperty()
    @IsNumber()
    @Min(0.0001)
    quantity!: number;

    // Optional Batch ID (if existing) or Code (if new/lookup)
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    batchCode?: string; // Simplification: Use code for now
}

export class CreateStockMovementDto {
    @ApiProperty({ enum: MovementType })
    @IsEnum(MovementType)
    type!: MovementType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reference?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    fromWarehouseId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    toWarehouseId?: string;

    @ApiProperty({ type: [CreateStockMovementItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateStockMovementItemDto)
    items!: CreateStockMovementItemDto[];
}

export class StockMovementDto extends CreateStockMovementDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({ enum: MovementStatus })
    status!: MovementStatus;

    @ApiProperty()
    code!: string;

    @ApiProperty()
    date!: Date;
}
