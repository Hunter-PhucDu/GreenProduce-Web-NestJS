import { Controller, Body, Post, Get, Param, Delete } from '@nestjs/common';
import { CartItemResponseDto } from './dtos/response.dto';
import { CartItemService } from './cartItem.service';
import { AddCartItemRequestDto } from './dtos/request.dto';
import { ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ERole } from 'modules/shared/enums/auth.enum';

@Controller('cart-items')
@ApiTags('Cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('')
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Add new cart item',
    description: 'Add new cart item',
  })
  @ApiSuccessResponse({ dataType: CartItemResponseDto })
  async addCartItem(@Body() body: AddCartItemRequestDto): Promise<CartItemResponseDto> {
    return await this.cartItemService.addCartItem(body);
  }

  @Get(':cartItemId')
  @ApiOperation({
    summary: 'Get cart item details',
    description: 'Get cart item details',
  })
  @ApiSuccessResponse({ dataType: CartItemResponseDto })
  async getCartItem(@Param('cartItemId', new ValidateObjectId()) cartItemId: string): Promise<CartItemResponseDto> {
    return await this.cartItemService.getCartItem(cartItemId);
  }

  @Delete(':cartItemId/remove')
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Remove cart item',
    description: 'Remove cart item',
  })
  async removeCartItem(@Param('cartItemId', new ValidateObjectId()) cartItemId: string): Promise<void> {
    await this.cartItemService.removeCartItem(cartItemId);
  }
}
