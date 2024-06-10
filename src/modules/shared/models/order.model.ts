import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrderModel {
  constructor(@InjectModel(Order.name) public model: PaginateModel<OrderDocument>) {}

  async save(order: Order) {
    const createdOrder = new this.model(order);
    return createdOrder.save();
  }
}
