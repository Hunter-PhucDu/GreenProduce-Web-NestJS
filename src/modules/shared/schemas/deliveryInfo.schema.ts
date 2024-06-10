import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type DeliveryInfoDocument = DeliveryInfo & Document;

@Schema({
  collection: 'DeliveryInfos',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class DeliveryInfo {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;
}

export const DeliveryInfoSchema = SchemaFactory.createForClass(DeliveryInfo);
DeliveryInfoSchema.plugin(mongoosePaginate);
DeliveryInfoSchema.index({ owner: 1 });
