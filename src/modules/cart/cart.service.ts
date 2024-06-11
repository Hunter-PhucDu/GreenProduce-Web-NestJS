import { BadRequestException, Injectable } from '@nestjs/common';
import { CartResponseDto } from './dtos/response.dto';
import { CartModel } from 'modules/shared/models/cart.model';
import { CartItemModel } from 'modules/shared/models/cartItem.model';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartModel: CartModel,
    private readonly cartItemModel: CartItemModel,
  ) {}

  async getCart(user): Promise<CartResponseDto> {
    try {
      const userId = new Types.ObjectId(user._id);
      const cartDoc = await this.cartModel.model.findOne({ owner: userId }).populate({
        path: 'items',
        populate: [
          { path: 'productId', model: 'Product' },
          { path: 'productVariantId', model: 'ProductVariant' },
        ],
      });

      if (!cartDoc) throw new BadRequestException('Cart does not exist');
      return plainToInstance(CartResponseDto, cartDoc.toObject(), { excludeExtraneousValues: true });
    } catch (e) {
      throw new BadRequestException(`Error while getting cart details: ${e.message}`);
    }
  }

  async addItemToCart(user, itemId: string): Promise<CartResponseDto> {
    const session = await this.cartModel.model.db.startSession();
    session.startTransaction();
    try {
      const userId = new Types.ObjectId(user._id);
      const cartItemId = new Types.ObjectId(itemId);
      const existedCart = await this.cartModel.model.findOne({ owner: userId });
      if (!existedCart) throw new BadRequestException('Cart does not exist');

      const existedCartItem = await this.cartItemModel.model.findById(cartItemId);
      if (!existedCartItem) throw new BadRequestException('Item does not exist');

      existedCart.items.push(existedCartItem);
      const updatedCart = await existedCart.save({ session });

      await session.commitTransaction();
      return plainToInstance(CartResponseDto, updatedCart.toObject());
    } catch (e) {
      await session.abortTransaction();
      throw new BadRequestException(`Error while adding item to cart: ${e.message}`);
    } finally {
      session.endSession();
    }
  }

  async removeCartItem(user, cartItemId: string): Promise<void> {
    const session = await this.cartModel.model.db.startSession();
    session.startTransaction();

    try {
      const userId = new Types.ObjectId(user._id);
      const cartDoc = await this.cartModel.model.findOne({ owner: userId });
      if (!cartDoc) throw new BadRequestException('Cart does not exist');
      const existedCartItem = await this.cartItemModel.model.findById(cartItemId);
      if (!existedCartItem) throw new BadRequestException('Item does not exist');

      cartDoc.items = cartDoc.items.filter((item) => item['_id'].toString() !== cartItemId);

      await cartDoc.save();

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw new BadRequestException(`Error while removing item: ${e.message}`);
    } finally {
      session.endSession();
    }
  }
}
