import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AuthService } from '../../modules/auth/auth.service';
import { ListRecordSuccessResponseDto } from '../../modules/shared/dtos/list-record-success-response.dto';
import { MetadataResponseDto } from '../../modules/shared/dtos/metadata-response.dto';
import { ERole } from '../../modules/shared/enums/auth.enum';
import { IJwtPayload } from '../../modules/shared/interfaces/auth.interface';
import { UserModel } from '../../modules/shared/models/user.model';
import { getPagination } from '../../modules/shared/utils/get-pagination';
import {
  AddAdminRequestDto,
  AddDeliveryInfoRequestDto,
  ChangePasswordRequestDto,
  GetUsersRequestDto,
  UpdateDeliveryInfoRequestDto,
  UpdateUserRequestDto,
} from './dtos/request.dto';
import {
  AddAdminResponseDto,
  ChangePasswordResponseDto,
  DeliveryInfoResponseDto,
  UserResponseDto,
} from './dtos/response.dto';
import { Types } from 'mongoose';
import { DeliveryInfoModel } from 'modules/shared/models/deliveryInfo.model';
import { CartModel } from 'modules/shared/models/cart.model';
import { AdminModel } from 'modules/shared/models/admin.model';

@Injectable()
export class UserService {
  constructor(
    private readonly adminModel: AdminModel,
    private readonly userModel: UserModel,
    private readonly authService: AuthService,
    private readonly cartModel: CartModel,
    private readonly deliveryInfoModel: DeliveryInfoModel,
  ) {}

  async addAdmin(addAdminDto: AddAdminRequestDto): Promise<AddAdminResponseDto> {
    try {
      const { userName, email, password } = addAdminDto;
      const existedUser = await this.adminModel.model.findOne({
        $or: [{ userName }, { email }],
      });

      if (existedUser) {
        throw new BadRequestException('UserName, Email or phone number has been registered.');
      }

      const hashedPw = await this.authService.hashPassword(password);

      const newUser = await this.adminModel.save({
        ...addAdminDto,
        password: hashedPw,
        role: ERole.ADMIN,
      });
      return plainToClass(AddAdminResponseDto, newUser.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while add new admin: ${error.message}`);
    }
  }

  async getUser(user: IJwtPayload): Promise<UserResponseDto> {
    if (user.role === ERole.USER) {
      if (user._id !== user._id) throw new UnauthorizedException('User is not allowed for this action');
    }

    const userDoc = await this.userModel.model.findById(user._id);
    return plainToInstance(UserResponseDto, userDoc.toObject());
  }

  async updateUser(user: IJwtPayload, updateUserDto: UpdateUserRequestDto, avatar?: string): Promise<UserResponseDto> {
    try {
      if (user.role === ERole.USER) {
        delete updateUserDto.email;
        delete updateUserDto.phone;
      }

      const updateData: any = { ...updateUserDto };
      if (avatar) {
        updateData.avatar = avatar;
      }

      const updatedUser = await this.userModel.model.findOneAndUpdate(
        { _id: user._id },
        { $set: updateData },
        { new: true },
      );

      if (!updatedUser) {
        throw new BadRequestException('User not found');
      }

      return plainToClass(UserResponseDto, updatedUser.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating user: ${error.message}`);
    }
  }

  async changePassword(
    user: IJwtPayload,
    changePasswordDto: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      const existedUser = await this.userModel.model.findById({ _id: user._id });
      if (!existedUser) {
        throw new BadRequestException('User not found');
      }
      const checkPw = await this.authService.checkPassword(changePasswordDto.password, existedUser.password);
      if (!checkPw) {
        throw new BadRequestException('Wrong password');
      }

      const hashedPw = await this.authService.hashPassword(changePasswordDto.newPassword);

      const updatedPw = await this.userModel.model.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPw },
        { new: true },
      );

      return plainToClass(ChangePasswordResponseDto, updatedPw.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while changing password: ${error.message}`);
    }
  }

  async getUsers(paginationDto: GetUsersRequestDto): Promise<ListRecordSuccessResponseDto<UserResponseDto>> {
    const { page, size, search } = paginationDto;
    const skip = (page - 1) * size;

    const searchCondition = search
      ? { $or: [{ fullName: { $regex: new RegExp(search, 'i') } }, { email: { $regex: new RegExp(search, 'i') } }] }
      : {};

    const [users, totalItem] = await Promise.all([
      this.userModel.model.find(searchCondition).skip(skip).limit(size).exec(),
      this.userModel.model.countDocuments(searchCondition),
    ]);

    const metadata: MetadataResponseDto = getPagination(size, page, totalItem);
    const userResponseDtos: UserResponseDto[] = plainToInstance(UserResponseDto, users);

    return {
      metadata,
      data: userResponseDtos,
    };
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const deletedCart = await this.cartModel.model.findOneAndDelete({ owner: userId });
      const deletedUser = await this.userModel.model.findOneAndDelete({ _id: userId });

      if (!deletedCart) {
        throw new BadRequestException('Cart not found');
      }

      if (!deletedUser) {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(`Error while deleting user: ${error.message}`);
    }
  }

  async addDeliveryInfo(user, addDeliveryInfoDto: AddDeliveryInfoRequestDto): Promise<DeliveryInfoResponseDto> {
    try {
      const userId = new Types.ObjectId(user._id);

      const newDelivery = await this.deliveryInfoModel.save({
        owner: userId,
        ...addDeliveryInfoDto,
      });

      return plainToClass(DeliveryInfoResponseDto, newDelivery.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while add delivery info: ${error.message}`);
    }
  }

  async updateDeliveryInfo(
    deliveryInfoId: string,
    updateDeliveryInfoDto: UpdateDeliveryInfoRequestDto,
  ): Promise<DeliveryInfoResponseDto> {
    try {
      const updatedDelivery = await this.deliveryInfoModel.model.findOneAndUpdate(
        { _id: deliveryInfoId },
        { $set: updateDeliveryInfoDto },
        { new: true },
      );

      if (!updatedDelivery) {
        throw new BadRequestException('Delivery info not found');
      }
      return plainToClass(DeliveryInfoResponseDto, updatedDelivery.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating Delivery info: ${error.message}`);
    }
  }

  async removeDeliveryInfo(deliveryInfoId: string): Promise<void> {
    try {
      const deletedDelivery = await this.deliveryInfoModel.model.findOneAndDelete({ _id: deliveryInfoId });

      if (!deletedDelivery) {
        throw new BadRequestException('Delivery not found');
      }
    } catch (error) {
      throw new BadRequestException(`Error while deleting Delivery: ${error.message}`);
    }
  }
}
