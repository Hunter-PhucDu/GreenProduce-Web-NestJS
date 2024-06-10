import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResponseDto, ProductsResponseDto } from './dtos/response.dto';
import { AddProductRequestDto, GetProductsRequestDto, UpdateProductRequestDto } from './dtos/request.dto';
import { Roles } from 'modules/shared/decorators/role.decorator';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessPaginationResponse, ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { RolesGuard } from 'modules/shared/gaurds/role.gaurd';
import { ERole } from 'modules/shared/enums/auth.enum';
import { ValidateObjectId } from 'modules/shared/validators/id.validator';
import { plainToInstance } from 'class-transformer';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MultipleImageFilesValidationPipe } from 'modules/shared/validators/file.validator';
import { ListRecordSuccessResponseDto } from 'modules/shared/dtos/list-record-success-response.dto';

const productImageStorageConfig: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileType = file.mimetype.split('/')[1];
      const destFileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileType}`;
      cb(null, destFileName);
    },
  }),
};

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Add new product',
    description: 'Add new product',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, productImageStorageConfig))
  @ApiSuccessResponse({ dataType: ProductResponseDto })
  async createProduct(
    @UploadedFiles(new MultipleImageFilesValidationPipe()) images: Express.Multer.File[],
    @Body() body: AddProductRequestDto,
  ): Promise<ProductResponseDto> {
    const filenames = images.map((file) => file.filename);
    return await this.productService.addProduct(body, filenames);
  }

  @Put(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Updating product ',
    description: 'Updating product ',
  })
  @ApiSuccessResponse({ dataType: ProductResponseDto })
  async changePassword(
    @Body() body: UpdateProductRequestDto,
    @Param('productId', new ValidateObjectId()) productId: string,
  ): Promise<ProductResponseDto> {
    const res = await this.productService.updateProduct(productId, body);
    return plainToInstance(ProductResponseDto, res);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get product  details',
    description: 'Get product  details',
  })
  @ApiSuccessResponse({ dataType: ProductResponseDto })
  async getCourse(@Param('productId', new ValidateObjectId()) productId: string): Promise<ProductResponseDto> {
    return await this.productService.getProduct(productId);
  }

  @Get('')
  @ApiSuccessPaginationResponse({ dataType: ProductsResponseDto })
  async getProducts(): Promise<ProductResponseDto[]> {
    return await this.productService.getProducts();
  }

  @Get('search')
  @ApiSuccessPaginationResponse({ dataType: ProductResponseDto })
  async findWithPagination(
    @Query() getProductsRequestDto: GetProductsRequestDto,
  ): Promise<ListRecordSuccessResponseDto<ProductResponseDto>> {
    return await this.productService.getProductsBySearch(getProductsRequestDto);
  }

  @Delete(':productId/remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Remove product ',
    description: 'Remove product ',
  })
  async removeUsersInCourse(@Param('productId', new ValidateObjectId()) productId: string): Promise<void> {
    await this.productService.removeProduct(productId);
  }
}
