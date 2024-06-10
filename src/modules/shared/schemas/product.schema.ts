import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ECategory } from '../enums/category.enum';
//import { ProductVariant } from './productVariant.schema';
export type ProductDocument = Product & Document;

@Schema({
  collection: 'Products',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Product {
  @Prop({ required: true, type: String })
  productName: string;

  @Prop({ required: true, type: [String], default: [] })
  images: string[];

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  origin: string;

  @Prop({ required: true, type: String, enum: ECategory, default: ECategory.ORGANIC })
  category: ECategory;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({ required: false, type: Number, default: 0 })
  sale?: number;

  @Prop({ required: false, type: Number, default: 0 })
  quantitySold?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ productName: 1 });
ProductSchema.index({ category: 1 });
