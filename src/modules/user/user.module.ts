import { Module } from '@nestjs/common';
import { AuthModule } from '../../modules/auth/auth.module';
import { SharedModule } from '../../modules/shared/shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
