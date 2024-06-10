import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import models from './models';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Order, OrderSchema } from './schemas/order.schema';
import { Cart, CartSchema } from './schemas/cart.schema';
import { DeliveryInfo, DeliveryInfoSchema } from './schemas/deliveryInfo.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductVariant, ProductVariantSchema } from './schemas/productVariant.schema';
import { CartItem, CartItemSchema } from './schemas/cartItem.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('app.auth.jwtSecret'),
          signOptions: {
            expiresIn: configService.get('app.auth.jwtTokenExpiry'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('db.uri'),
        };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Order.name, schema: OrderSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductVariant.name, schema: ProductVariantSchema },
      { name: DeliveryInfo.name, schema: DeliveryInfoSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: configService.get('mail.mailAddress'),
            pass: configService.get('mail.password'),
          },
          tlsOptions: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
  providers: [Logger, JwtStrategy, ...models],
  exports: [Logger, JwtStrategy, JwtModule, ConfigModule, ...models],
})
export class SharedModule { }
