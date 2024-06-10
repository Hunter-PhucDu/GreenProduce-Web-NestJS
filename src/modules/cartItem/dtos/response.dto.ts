import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

// @Exclude()
// export class CartItemResponseDto {
//   @Expose()
//   @ApiProperty({
//     required: true,
//     type: String,
//     example: '60d0fe4f5311236168a109ca',
//   })
//   @IsNotEmpty()
//   productId: string;

//   @Expose()
//   @ApiProperty({
//     required: true,
//     type: String,
//     example: '60d0fe4f5311236168a109ca',
//   })
//   @IsNotEmpty()
//   productVariantId: string;

//   @Expose()
//   @ApiProperty({
//     required: true,
//     type: Number,
//     example: 1,
//   })
//   @IsNotEmpty()
//   quantity: number;
// }


@Exclude()
export class ProductVariantResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Variant Name',
  })
  variantName: string;

  @Expose()
  @ApiProperty({
    type: Number,
    example: 100,
  })
  price: number;
}

@Exclude()
export class ProductResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Product Name',
  })
  productName: string;

  @Expose()
  @ApiProperty({
    type: ProductVariantResponseDto,
  })
  @Type(() => ProductVariantResponseDto)
  productVariant: ProductVariantResponseDto;
}

@Exclude()
export class CartItemResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  productId: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  productVariantId: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  quantity: number;

  @Expose()
  @Type(() => ProductResponseDto)
  @ApiProperty({
    type: ProductResponseDto,
  })
  product: ProductResponseDto;
}