import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateOrderRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    example: ['60d0fe4f5311236168a109ca', '60d0fe4f5311236168a109cb'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  products: string[];

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  deliveryInfo: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'CREDIT_CARD',
  })
  @IsNotEmpty()
  @IsEnum(['CASH', 'CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'])
  paymentMethod: string;
}

export class UpdateOrderStatusForUserRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'CANCELLED',
  })
  @IsNotEmpty()
  @IsEnum(['CANCELLED', 'DELIVERED', 'RETURNED'])
  status: string;
}

export class UpdateOrderStatusForAdminRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'CANCELLED',
  })
  @IsNotEmpty()
  @IsEnum([
    'PENDING',
    'PROCESSING',
    'CONFIRMED',
    'READY_FOR_SHIPPING',
    'CANCELLED',
    'SHIPPING',
    'SHIPPED',
    'DELIVERED',
    'RETURNED',
  ])
  status: string;
}
