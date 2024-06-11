import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

@Exclude()
export class ProductResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Cà phê',
  })
  @IsNotEmpty()
  productName: string;

  @IsArray()
  @IsOptional()
  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  images: any[];

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Cà phê ngon...',
  })
  @IsNotEmpty()
  description: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Thuận Châu - Sơn La',
  })
  @IsNotEmpty()
  origin: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'Vegetable',
  })
  @IsNotEmpty()
  category: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Bán',
  })
  @IsNotEmpty()
  status: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  sale?: number;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 0,
  })
  @IsOptional()
  quantitySold?: number;
}

@Exclude()
export class ProductsResponseDto {
  @Expose()
  @Type(() => ProductResponseDto)
  @ApiProperty({
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];
}
