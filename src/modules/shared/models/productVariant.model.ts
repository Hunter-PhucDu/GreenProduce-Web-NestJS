import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ProductVariant, ProductVariantDocument } from '../schemas/productVariant.schema';

@Injectable()
export class ProductVariantModel {
  constructor(@InjectModel(ProductVariant.name) public model: PaginateModel<ProductVariantDocument>) {}

  async save(productVariant: ProductVariant) {
    const createdProductVariant = new this.model(productVariant);
    return createdProductVariant.save();
  }
}
