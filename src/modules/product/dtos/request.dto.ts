import { IsNotEmpty, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ECategory } from 'modules/shared/enums/category.enum';
import { PaginationDto } from 'modules/shared/dtos/pagination.dto';

@Exclude()
export class AddProductRequestDto {
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
    format: 'binary',
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

  @ApiProperty({ enum: ECategory, default: ECategory.ORGANIC })
  @Expose()
  @IsNotEmpty()
  @IsEnum(ECategory)
  category: ECategory;

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
}

@Exclude()
export class UpdateProductRequestDto {
  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Cà phê',
  })
  @IsOptional()
  productName?: string;

  @IsArray()
  @IsOptional()
  @Expose()
  @ApiProperty({
    required: true,
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  image?: string[];

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Cà phê ngon...',
  })
  @IsOptional()
  description?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Thuận Châu - Sơn La',
  })
  @IsOptional()
  origin?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: '60d0fe4f5311236168a109ca',
  })
  @IsOptional()
  category?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    example: 'Bán',
  })
  @IsOptional()
  status?: string;

  @Expose()
  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  @IsOptional()
  sale?: number;
}

export class GetProductsRequestDto extends PaginationDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search pattern by title or description',
  })
  @IsOptional()
  search?: string;
}
