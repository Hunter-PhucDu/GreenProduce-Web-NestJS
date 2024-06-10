import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class AddCartItemRequestDto {
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
}

@Exclude()
export class UpdateCartItemRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  quantity: number;
}
