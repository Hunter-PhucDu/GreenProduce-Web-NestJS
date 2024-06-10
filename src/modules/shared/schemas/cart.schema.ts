import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { CartItem } from './cartItem.schema';

export type CartDocument = Cart &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  collection: 'Carts',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: CartItem.name }], default: [] })
  items?: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.plugin(mongoosePaginate);
CartSchema.index({ owner: 1 });
