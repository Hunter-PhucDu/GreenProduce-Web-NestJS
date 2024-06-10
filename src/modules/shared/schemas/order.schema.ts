// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';
// export type OrderDocument = Order & Document;

// @Schema({
//   collection: 'Orders',
//   timestamps: {
//     createdAt: 'createdAt',
//     updatedAt: 'updatedAt',
//   },
// })
// export class Order {
//   @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
//   owner: Types.ObjectId;

//   @Prop({ type: Date, required: true })
//   orderDate: Date;

//   @Prop({ type: Date })
//   shippedDate: Date;

//   @Prop({
//     type: String,
//     enum: ['PENDING', 'CANCELLED', 'CONFIRMED'],
//     default: 'PENDING',
//     required: true,
//   })
//   status: string;

//   @Prop([
//     {
//       product: { type: Types.ObjectId, ref: 'Product', required: true },
//       quantityOrdered: { type: Number, required: true },
//     },
//   ])
//   products: { product: Types.ObjectId; quantityOrdered: number }[];

//   @Prop({ type: Types.ObjectId, ref: 'DeliveryInfo', required: true })
//   deliveryInfo: Types.ObjectId;
// }

// export const OrderSchema = SchemaFactory.createForClass(Order);
// OrderSchema.plugin(mongoosePaginate);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Cart } from './cart.schema';

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
    enum: ['PENDING', 'CANCELLED', 'CONFIRMED'],
    default: 'PENDING',
    required: true,
  })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Cart.name }], default: [] })
  products: Cart[];

  @Prop({ type: Types.ObjectId, ref: 'DeliveryInfo', required: true })
  deliveryInfo: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongoosePaginate);
OrderSchema.index({ owner: 1 });
