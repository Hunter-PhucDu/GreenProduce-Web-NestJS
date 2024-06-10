import { BadRequestException, Injectable } from '@nestjs/common';
import { AddProductVariantRequestDto, UpdateProductVariantRequestDto } from './dtos/request.dto';
import { ProductVariantModel } from 'modules/shared/models/productVariant.model';
import { ProductVariantResponseDto } from './dtos/response.dto';
import { Types } from 'mongoose';
import { ProductModel } from 'modules/shared/models/product.model';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productModel: ProductModel,
    private readonly productVariantModel: ProductVariantModel,
  ) {}
  async addProductVariant(addProductVariantDto: AddProductVariantRequestDto): Promise<ProductVariantResponseDto> {
    const session = await this.productVariantModel.model.db.startSession();
    session.startTransaction();
    try {
      const productDoc = await this.productModel.model.findById(addProductVariantDto.productId);
      if (!productDoc) throw new BadRequestException('Product does not exist');
      const productId = new Types.ObjectId(addProductVariantDto.productId);
      const addedVariant = await this.productVariantModel.save({ ...addProductVariantDto, productId });

      await session.commitTransaction();

      return plainToInstance(ProductVariantResponseDto, addedVariant.toObject());
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  async getProductVariant(productVariantId: string): Promise<ProductVariantResponseDto> {
    try {
      const variantDoc = await this.productVariantModel.model.findById(productVariantId);
      if (!variantDoc) {
        throw new BadRequestException('Product variant does not exist');
      }
      return plainToInstance(ProductVariantResponseDto, variantDoc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while get product variant details: ${e.message}`);
    }
  }

  async updateProductVariant(
    productVariantId: string,
    updateProductVariantDto: UpdateProductVariantRequestDto,
  ): Promise<ProductVariantResponseDto> {
    try {
      const updatedVariant = await this.productVariantModel.model.findOneAndUpdate(
        { _id: productVariantId },
        { $set: updateProductVariantDto },
        { new: true },
      );

      if (!updatedVariant) {
        throw new BadRequestException('Product variant not found');
      }
      return plainToClass(ProductVariantResponseDto, updatedVariant.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating product variant: ${error.message}`);
    }
  }

  async removeProductVariant(productVariantId: string): Promise<void> {
    try {
      const variantDoc = await this.productVariantModel.model.findById(productVariantId);
      if (!variantDoc) throw new BadRequestException('Cart item does not exist');
      await this.productVariantModel.model.findByIdAndRemove(productVariantId);
    } catch (e) {
      throw new BadRequestException(`Error while deleting product variant: ${e.message}`);
    }
  }
}
