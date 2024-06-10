import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';

@Injectable()
export class CartModel {
  constructor(@InjectModel(Cart.name) public model: PaginateModel<CartDocument>) {}

  async save(cart: Cart) {
    const createdCart = new this.model(cart);
    return createdCart.save();
  }

  async removeCartItem(cartId: string, cartItemId: string): Promise<CartDocument> {
    return this.model.findOneAndUpdate(
      { _id: cartId },
      { $pull: { items: new Types.ObjectId(cartItemId) } },
      { new: true },
    );
  }
}
