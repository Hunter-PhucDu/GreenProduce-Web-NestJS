import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CartItem, CartItemDocument } from '../schemas/cartItem.schema';

@Injectable()
export class CartItemModel {
  constructor(@InjectModel(CartItem.name) public model: PaginateModel<CartItemDocument>) {}

  async save(cartItem: CartItem) {
    const createdCartItem = new this.model(cartItem);
    return createdCartItem.save();
  }
}
