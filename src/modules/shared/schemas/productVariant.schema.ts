import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ProductVariantDocument = ProductVariant & Document;

@Schema({
  collection: 'ProductVariants',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class ProductVariant {
  @Prop({ required: true, type: String })
  variantName1: string;

  @Prop({ required: true, type: String })
  variantValue1: string;

  @Prop({ required: true, type: String })
  variantName2: string;

  @Prop({ required: true, type: String })
  variantValue2: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number, default: 0 })
  stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
ProductVariantSchema.plugin(mongoosePaginate);
