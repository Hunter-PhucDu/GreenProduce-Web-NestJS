import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductModel } from 'modules/shared/models/product.model';
import { AddProductRequestDto, GetProductsRequestDto, UpdateProductRequestDto } from './dtos/request.dto';
import { ProductResponseDto } from './dtos/response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from 'modules/shared/dtos/metadata-response.dto';
import { getPagination } from 'modules/shared/utils/get-pagination';

@Injectable()
export class ProductService {
  constructor(private readonly productModel: ProductModel) {}

  async addProduct(addProductDto: AddProductRequestDto, images: string[]): Promise<ProductResponseDto> {
    try {
      const session = await this.productModel.model.db.startSession();
      session.startTransaction();

      const newProduct = await this.productModel.save({ ...addProductDto, images });

      return plainToInstance(ProductResponseDto, newProduct.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while adding product: ${error.message}`);
    }
  }

  async getProduct(productId: string): Promise<ProductResponseDto> {
    try {
      const Doc = await this.productModel.model.findById(productId);
      if (!Doc) {
        throw new BadRequestException('Product  does not exist');
      }
      return plainToInstance(ProductResponseDto, Doc.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while get product details: ${e.message}`);
    }
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductRequestDto): Promise<ProductResponseDto> {
    try {
      const updated = await this.productModel.model.findOneAndUpdate(
        { _id: productId },
        { $set: updateProductDto },
        { new: true },
      );

      if (!updated) {
        throw new BadRequestException('Product  not found');
      }
      return plainToClass(ProductResponseDto, updated.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating : ${error.message}`);
    }
  }

  async removeProduct(productId: string): Promise<void> {
    try {
      const Doc = await this.productModel.model.findById(productId);
      if (!Doc) throw new BadRequestException('Product  does not exist');
      await this.productModel.model.findByIdAndRemove(productId);
    } catch (e) {
      throw new BadRequestException(`Error while deleting product : ${e.message}`);
    }
  }

  async getProducts(): Promise<ProductResponseDto[]> {
    try {
      const productsDoc = await this.productModel.model.find().exec();
      return productsDoc.map((doc) => ({
        productName: doc.productName,
        images: doc.images,
        description: doc.description,
        origin: doc.origin,
        category: doc.category,
        status: doc.status,
        sale: doc.sale,
        quantitySold: doc.quantitySold,
      }));
    } catch (e) {
      throw new BadRequestException(`Error while getting products: ${e.message}`);
    }
  }

  async getProductsBySearch(
    paginationDto: GetProductsRequestDto,
  ): Promise<ListRecordSuccessResponseDto<ProductResponseDto>> {
    const { page, size, search } = paginationDto;
    const skip = (page - 1) * size;

    const searchCondition = search ? { fullName: { $regex: new RegExp(search, 'i') } } : {};

    const [products, totalItem] = await Promise.all([
      this.productModel.model.find(searchCondition).skip(skip).limit(size).exec(),
      this.productModel.model.countDocuments(searchCondition),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const productResponseDtos: ProductResponseDto[] = plainToInstance(ProductResponseDto, products);

    return {
      metadata,
      data: productResponseDtos,
    };
  }
}
