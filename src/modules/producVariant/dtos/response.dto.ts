import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class ProductVariantResponseDto {
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
