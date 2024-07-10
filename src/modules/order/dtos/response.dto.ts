import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { TransformMongoId } from '../../../modules/shared/decorators/transform.decorator';
import { Types } from 'mongoose';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CartItemResponseDto } from 'modules/cart/dtos/response.dto';

export class OrderResponseDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abcd...',
  })
  @TransformMongoId()
  _id: Types.ObjectId;

  @Expose()
  @ApiProperty({
    type: String,
    example: '60d0fe4f5311236168a109cc',
  })
  owner: string;

  @ApiProperty({
    type: Date,
    required: true,
    example: '01/06/2024',
  })
  @Expose()
  orderDate: Date;

  @ApiProperty({
    type: Date,
    required: false,
    example: '09/06/2024',
  })
  @Expose()
  @IsOptional()
  shippedDate?: Date;

  @ApiProperty({
    required: true,
    example: 'PENDING',
  })
  @Expose()
  @IsEnum(['PENDING', 'CANCELLED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'RETURNED'])
  status: string;

  @Expose()
  @Type(() => CartItemResponseDto)
  @ApiProperty({
    type: [CartItemResponseDto],
  })
  products: CartItemResponseDto[];

  @ApiProperty({
    required: true,
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @Expose()
  deliveryInfo: string;

  @ApiProperty({
    required: true,
    type: Number,
    example: 120000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalAmount: number;

  @ApiProperty({
    required: true,
    type: String,
    example: 'CREDIT_CARD',
  })
  @IsNotEmpty()
  @Expose()
  @IsEnum(['CASH', 'CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'])
  paymentMethod: string;
}

@Exclude()
export class OrdersResponseDto {
  @Expose()
  @Type(() => OrderResponseDto)
  @ApiProperty({
    type: [OrderResponseDto],
  })
  orders: OrderResponseDto[];
}
