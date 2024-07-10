import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from 'modules/auth/auth.module';
import { CartModule } from 'modules/cart/cart.module';
import { CartItemModule } from 'modules/cartItem/cartItem.module';
import { OrderModule } from 'modules/order/order.module';
import { ProductVariantModule } from 'modules/producVariant/productVariant.module';
import { ProductModule } from 'modules/product/product.module';
import { SharedModule } from 'modules/shared/shared.module';
import { UserModule } from 'modules/user/user.module';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    CartModule,
    CartItemModule,
    ProductVariantModule,
    ProductModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
  ],
})
export class AppModule {}
