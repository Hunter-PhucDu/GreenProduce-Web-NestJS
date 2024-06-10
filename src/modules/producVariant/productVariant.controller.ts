import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductVariantService } from './productVariant.service';
import { AddProductVariantRequestDto } from './dtos/request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { ProductVariantResponseDto } from './dtos/response.dto';
import { ERole } from 'modules/shared/enums/auth.enum';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';

@Controller('product-variants')
@ApiTags('product-variants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles([ERole.ADMIN])
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}
  @Post('')
  @ApiOperation({
    summary: 'Add new product variant',
    description: 'Add new product variant',
  })
  @ApiSuccessResponse({ dataType: ProductVariantResponseDto })
  async createCart(
    @Body() body: AddProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    return await this.productVariantService.addProductVariant(body);
  }

  @Get(':productVariantId')
  @ApiOperation({
    summary: 'Get product variant details',
    description: 'Get product variant details',
  })
  @ApiSuccessResponse({ dataType: ProductVariantResponseDto })
  async getCourse(
    @Param('productVariantId', new ValidateObjectId()) productVariantId: string,
  ): Promise<ProductVariantResponseDto> {
    return await this.productVariantService.getProductVariant(productVariantId);
  }

  @Delete(':productVariantId/remove')
  @ApiOperation({
    summary: 'Remove product variant',
    description: 'Remove product variant',
  })
  async removeUsersInCourse(
    @Param('productVariantId', new ValidateObjectId()) productVariantId: string,
  ): Promise<void> {
    await this.productVariantService.removeProductVariant(productVariantId);
  }
}
