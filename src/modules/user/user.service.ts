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
  ChangePasswordRequestDto,
  GetUsersRequestDto,
  UpdateUserRequestDto,
} from './dtos/request.dto';
import { ChangePasswordResponseDto, UserResponseDto } from './dtos/response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly authService: AuthService,
  ) { }

  async updateUser(user: IJwtPayload, userId: string, updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    try {
      if (user.role === ERole.USER) {
        delete updateUserDto.email;
        delete updateUserDto.phone;
      }

      const updatedUser = await this.userModel.model.findOneAndUpdate(
        { _id: userId },
        { $set: updateUserDto },
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
    userId: string,
    changePasswordDto: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      const existedUser = await this.userModel.model.findById({ _id: userId });
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

  async deleteUser(userId: string): Promise<void> {
    try {
      const deletedUser = await this.userModel.model.findOneAndDelete({ _id: userId });

      if (!deletedUser) {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(`Error while deleting user: ${error.message}`);
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

  async getUser(user: IJwtPayload, userId: string): Promise<UserResponseDto> {
    if (user.role === ERole.USER) {
      if (user._id !== userId) throw new UnauthorizedException('User is not allowed for this action');
    }

    const userDoc = await this.userModel.model.findById(userId);
    return plainToInstance(UserResponseDto, userDoc.toObject());
  }
}
