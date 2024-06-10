import {
  Body,
  Controller,
  Put,
  Delete,
  UseGuards,
  Param,
  Get,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  ChangePasswordRequestDto,
  GetUsersRequestDto,
  UpdateUserRequestDto,
} from './dtos/request.dto';
import { ChangePasswordResponseDto, UserResponseDto } from './dtos/response.dto';
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

  @Put(':userId/settings')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update user by admin or user',
    description: 'Update user by admin or user',
  })
  @UseInterceptors(FileInterceptor('avatar', userAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async updateUser(
    @Body() body: UpdateUserRequestDto,
    @Param('userId', new ValidateObjectId()) userId: string,
    @Req() req,
  ): Promise<UserResponseDto> {
    const user: IJwtPayload = req.user;
    const res = await this.userService.updateUser(user, userId, body);
    return plainToInstance(UserResponseDto, res);
  }

  @Put(':userId/change-password')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Change password user',
    description: 'Change password user',
  })
  @ApiSuccessResponse({ dataType: ChangePasswordResponseDto })
  async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Param('userId', new ValidateObjectId()) userId: string,
    @Req() req,
  ): Promise<ChangePasswordResponseDto> {
    const user: IJwtPayload = req.user;
    const res = await this.userService.changePassword(user, userId, body);
    return plainToInstance(ChangePasswordResponseDto, { newPassword: res.newPassword });
  }

  @Get(':userId')
  @Roles([ERole.ADMIN, ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get user by userId',
    description: 'Get user by userId',
  })
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async getUser(@Param('userId', new ValidateObjectId()) userId: string, @Req() req): Promise<UserResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.userService.getUser(user, userId);
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

  @Get('')
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
}
