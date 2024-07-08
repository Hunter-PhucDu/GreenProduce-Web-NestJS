import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  UseGuards,
  Param,
  Get,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  ApiSuccessPaginationResponse,
  ApiSuccessResponse,
} from '../../modules/shared/decorators/api-success-response.decorator';
import { Roles } from '../../modules/shared/decorators/role.decorator';
import { ERole } from '../../modules/shared/enums/auth.enum';
import { JwtAuthGuard } from '../../modules/shared/gaurds/jwt.guard';
import { RolesGuard } from '../../modules/shared/gaurds/role.gaurd';
import {
  AddDeliveryInfoRequestDto,
  ChangePasswordRequestDto,
  GetUsersRequestDto,
  UpdateUserRequestDto,
} from './dtos/request.dto';
import { ChangePasswordResponseDto, DeliveryInfoResponseDto, UserResponseDto } from './dtos/response.dto';
import { UserService } from './user.service';
import { ValidateObjectId } from '../../modules/shared/validators/id.validator';
import { IJwtPayload } from '../../modules/shared/interfaces/auth.interface';
import { ListRecordSuccessResponseDto } from '../shared/dtos/list-record-success-response.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const userAvatarStorageConfig: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileType = file.mimetype.split('/')[1];
      const destFileName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileType}`;
      cb(null, destFileName);
    },
  }),
};

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get detail user',
    description: 'Get detail user',
  })
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async getUser(@Req() req): Promise<UserResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.userService.getUser(user);
  }

  @Put('settings')
  @Roles([ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update user form-data',
    type: UpdateUserRequestDto,
  })
  @UseInterceptors(FileInterceptor('avatar', userAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async updateUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: UpdateUserRequestDto,
    @Req() req,
  ): Promise<UserResponseDto> {
    const user: IJwtPayload = req.user;
    const res = await this.userService.updateUser(user, body, avatar?.filename);
    return plainToInstance(UserResponseDto, res);
  }

  @Put('change-password')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Change password user',
    description: 'Change password user',
  })
  @ApiSuccessResponse({ dataType: ChangePasswordResponseDto })
  async changePassword(@Body() body: ChangePasswordRequestDto, @Req() req): Promise<ChangePasswordResponseDto> {
    const user: IJwtPayload = req.user;
    const res = await this.userService.changePassword(user, body);
    return plainToInstance(ChangePasswordResponseDto, { newPassword: res.newPassword });
  }

  @Get('users')
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get pagination users',
    description: 'Get pagination users',
  })
  @ApiSuccessPaginationResponse({ dataType: UserResponseDto })
  async findWithPagination(
    @Query() getUsersRequestDto: GetUsersRequestDto,
  ): Promise<ListRecordSuccessResponseDto<UserResponseDto>> {
    return await this.userService.getUsers(getUsersRequestDto);
  }

  @Delete(':userId')
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user',
  })
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.deleteUser(userId);
  }
  @Post('DeliveryInfo')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Add new delivery info',
    description: 'Add new delivery info',
  })
  @ApiSuccessResponse({ dataType: DeliveryInfoResponseDto })
  async addDeliveryInfo(@Body() body: AddDeliveryInfoRequestDto, @Req() req): Promise<DeliveryInfoResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.userService.addDeliveryInfo(user, body);
  }

  @Put('DeliveryInfo/:deliveryInfoId')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update delivery info',
    description: 'Update delivery info',
  })
  @UseInterceptors(FileInterceptor('avatar', userAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async updateDeliveryInfo(
    @Body() body: DeliveryInfoResponseDto,
    @Param('deliveryInfoId', new ValidateObjectId()) deliveryInfoId: string,
  ): Promise<UserResponseDto> {
    const res = await this.userService.updateDeliveryInfo(deliveryInfoId, body);
    return plainToInstance(UserResponseDto, res);
  }

  @Delete('DeliveryInfo/:deliveryInfoId')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Remove delivery info',
    description: 'Remove delivery info',
  })
  async removeDeliveryInfo(@Param('deliveryInfoId', new ValidateObjectId()) deliveryInfoId: string): Promise<void> {
    await this.userService.removeDeliveryInfo(deliveryInfoId);
  }
}
