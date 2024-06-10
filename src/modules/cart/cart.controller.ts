import { Controller, Post, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResponseDto } from './dtos/response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ERole } from 'modules/shared/enums/auth.enum';
import { IJwtPayload } from 'modules/shared/interfaces/auth.interface';

@Controller('carts')
@ApiTags('Carts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles([ERole.ADMIN, ERole.USER])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get cart details',
    description: 'Get cart details',
  })
  @ApiSuccessResponse({ dataType: CartResponseDto })
  async getCourse(@Req() req): Promise<CartResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.cartService.getCart(user);
  }

  @Post(':itemId')
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add item to cart',
  })
  async addItemToCart(@Req() req, @Param('itemId', new ValidateObjectId()) itemId: string): Promise<CartResponseDto> {
    const user: IJwtPayload = req.user;
    return this.cartService.addItemToCart(user, itemId);
  }

  @Delete('items/:cartItemId')
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Remove item from cart',
  })
  async removeCartItem(@Req() req, @Param('cartItemId') cartItemId: string): Promise<void> {
    const user: IJwtPayload = req.user;
    await this.cartService.removeCartItem(user, cartItemId);
  }
}
