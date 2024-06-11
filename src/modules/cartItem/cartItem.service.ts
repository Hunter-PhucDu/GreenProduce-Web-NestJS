import { BadRequestException, Injectable } from '@nestjs/common';
import { AddCartItemRequestDto } from './dtos/request.dto';
import { CartItemResponseDto } from './dtos/response.dto';
import { plainToInstance } from 'class-transformer';
import { CartItemModel } from 'modules/shared/models/cartItem.model';
import { ProductModel } from 'modules/shared/models/product.model';
import { ProductVariantModel } from 'modules/shared/models/productVariant.model';
import { Types } from 'mongoose';

@Injectable()
export class CartItemService {
  constructor(
    private readonly cartItemModel: CartItemModel,
    private readonly productModel: ProductModel,
    private readonly productVariantModel: ProductVariantModel,
  ) {}

  async addCartItem(addCartItemDto: AddCartItemRequestDto): Promise<CartItemResponseDto> {
    try {
      const session = await this.cartItemModel.model.db.startSession();
      session.startTransaction();
      const productId = new Types.ObjectId(addCartItemDto.productId);
      const productVariantId = new Types.ObjectId(addCartItemDto.productVariantId);

      const existedProduct = await this.productModel.model.findById(productId);
      if (!existedProduct) {
        throw new BadRequestException('Product does not exist');
      }

      const existedProductVariant = await this.productVariantModel.model.findById(productVariantId);
      if (!existedProductVariant) {
        throw new BadRequestException('Product variant does not exist');
      }

      if (!existedProductVariant.productId.equals(existedProduct._id)) {
        throw new BadRequestException('Product variant does not belong to the specified product');
      }
      const addCartItem = await this.cartItemModel.save({
        ...addCartItemDto,
        productId: productId,
        productVariantId: productVariantId,
      });
      return plainToInstance(CartItemResponseDto, addCartItem.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while add cart item: ${e.message}`);
    }
  }

  async getCartItem(cartItemId: string): Promise<CartItemResponseDto> {
    try {
      const cartItemDoc = await this.cartItemModel.model.findById(cartItemId).populate([
        { path: 'productId', model: 'Product' },
        { path: 'productVariantId', model: 'ProductVariant' },
      ]);

      if (!cartItemDoc) throw new BadRequestException('Cart item does not exist');

      return plainToInstance(CartItemResponseDto, cartItemDoc.toObject(), { excludeExtraneousValues: true });
    } catch (e) {
      throw new BadRequestException(`Error while getting cart details: ${e.message}`);
    }
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    try {
      const cartItemDoc = await this.cartItemModel.model.findById(cartItemId);
      if (!cartItemDoc) throw new BadRequestException('Cart item does not exist');
      await this.cartItemModel.model.findByIdAndRemove(cartItemId);
    } catch (e) {
      throw new BadRequestException(`Error while remove cart item: ${e.message}`);
    }
  }
}
