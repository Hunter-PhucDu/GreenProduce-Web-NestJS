import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { CartItem } from './cartItem.schema';

export type OrderDocument = Order & Document;

@Schema({
  collection: 'Orders',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Date, required: true })
  orderDate: Date;

  @Prop({ type: Date })
  shippedDate: Date;

  @Prop({
    type: String,
    enum: [
      'PENDING',
      'PROCESSING',
      'CONFIRMED',
      'READY_FOR_SHIPPING',
      'CANCELLED',
      'SHIPPING',
      'SHIPPED',
      'DELIVERED',
      'RETURNED',
    ],
    default: 'PENDING',
    required: true,
  })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: CartItem.name }], default: [] })
  products: CartItem[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: Types.ObjectId, ref: 'DeliveryInfo', required: true })
  deliveryInfo: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['CASH', 'CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER'],
    required: true,
  })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongoosePaginate);
OrderSchema.index({ owner: 1 });
