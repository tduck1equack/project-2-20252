import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsDecimal, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductVariantDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    sku!: string;

    @ApiProperty()
    productId!: string;
}

export class ProductDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    sku!: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    uomId!: string; // Unit of Measure

    @ApiProperty({ type: [ProductVariantDto] })
    variants!: ProductVariantDto[];
}

export class CreateProductVariantDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sku!: string;
}

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    uomId!: string;

    @ApiPropertyOptional({ type: [CreateProductVariantDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants?: CreateProductVariantDto[];
}
