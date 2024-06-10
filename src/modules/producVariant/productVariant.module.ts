import { Module } from '@nestjs/common';
import { ProductVariantService } from './productVariant.service';
import { ProductVariantController } from './productVariant.controller';
import { SharedModule } from 'modules/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class ProductVariantModule {}
