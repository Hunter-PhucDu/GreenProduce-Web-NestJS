import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddProductVariantRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Màu sắc',
  })
  @IsNotEmpty()
  variantName1: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Đen',
  })
  @IsNotEmpty()
  variantValue1: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Trọng lượng',
  })
  @IsNotEmpty()
  variantName2: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '1kg',
  })
  @IsNotEmpty()
  variantValue2: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 20000,
  })
  @IsNotEmpty()
  price: number;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  stock: number;

  @Expose()
  @ApiProperty({
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  productId: string;
}

@Exclude()
export class UpdateProductVariantRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Màu sắc',
  })
  @IsOptional()
  variantName1?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Đen',
  })
  @IsOptional()
  variantValue1?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Trọng lượng',
  })
  @IsOptional()
  variantName2?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '1kg',
  })
  @IsOptional()
  variantValue2?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 20000,
  })
  @IsOptional()
  price?: number;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 100,
  })
  @IsOptional()
  stock?: number;
}
