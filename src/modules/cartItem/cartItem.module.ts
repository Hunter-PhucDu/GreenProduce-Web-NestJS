import { Module } from '@nestjs/common';
import { CartItemService } from './cartItem.service';
import { CartItemController } from './cartItem.controller';
import { SharedModule } from 'modules/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
