import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type CartItemDocument = CartItem & Document;

@Schema({
  collection: 'CartItems',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ProductVariant', required: true })
  productVariantId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
CartItemSchema.plugin(mongoosePaginate);
