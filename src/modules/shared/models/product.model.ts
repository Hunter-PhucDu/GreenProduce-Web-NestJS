import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductModel {
  constructor(@InjectModel(Product.name) public model: PaginateModel<ProductDocument>) {}

  async save(product: Product) {
    const createdProduct = new this.model(product);
    return createdProduct.save();
  }
}
