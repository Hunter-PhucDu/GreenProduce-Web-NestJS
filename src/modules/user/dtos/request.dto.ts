import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { IsEmailOrPhone } from '../../../modules/shared/decorators/is-email-or-phone.decorator';
import { PaginationDto } from '../../../modules/shared/dtos/pagination.dto';
import { ESex } from 'modules/shared/enums/user.enum';

@Exclude()
export class UpdateUserRequestDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van B',
  })
  @IsOptional()
  fullName?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'abc123@gmail.com',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Email is not valid',
  })
  @Transform(({ value }) => value?.trim())
  email?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0371234567',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @Expose()
  @ApiProperty({
    enum: ESex,
    default: ESex.FEMALE,
  })
  @IsOptional()
  @IsEnum(ESex)
  sex?: ESex;

  @Expose()
  @ApiProperty({
    required: true,
    type: Date,
    example: '1/1/2000',
  })
  @IsOptional()
  dateOfBirth?: Date;
}

@Exclude()
export class ChangePasswordRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '******',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[^\s]*$/, {
    message: 'Password should not contain spaces.',
  })
  password: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '******',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^[^\s]*$/, {
    message: 'Password should not contain spaces.',
  })
  newPassword: string;
}

@Exclude()
export class AddDeliveryInfoRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0371234567',
  })
  @IsNotEmpty()
  @IsEmailOrPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Quyet Tam - TP.Son La',
  })
  @IsNotEmpty()
  address: string;
}

@Exclude()
export class UpdateDeliveryInfoRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Nguyen Van A',
  })
  @IsOptional()
  name?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: '0371234567',
  })
  @IsOptional()
  @IsEmailOrPhone({
    message: 'Phone number is not valid (VN)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Quyet Tam - TP.Son La',
  })
  @IsOptional()
  address?: string;
}

@Exclude()
export class GetUsersRequestDto extends PaginationDto {
  @Expose()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by fullName or email',
  })
  @IsOptional()
  search?: string;
}

@Exclude()
export class GetDeliveriesInfoRequestDto extends PaginationDto {}
