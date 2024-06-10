import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags,  ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, GenerateOtpDto, LoginRequestDto, LogOutRequestDto, RefreshTokenRequestDto, SignUpRequestDto } from './dtos/request.dto';
import { LoginResponseDto } from './dtos/response.dto';
import { JwtAuthGuard } from 'modules/shared/gaurds/jwt.guard';
import { ApiSuccessResponse } from 'modules/shared/decorators/api-success-response.decorator';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserResponseDto } from 'modules/user/dtos/response.dto';
import { SingleImageFileValidationPipe } from 'modules/shared/validators/file.validator';

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

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  userService: any;
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Login for user or admin',
    description: 'Login for user or admin',
  })
  @ApiSuccessResponse({ dataType: LoginResponseDto })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('sign-up')
  @ApiOperation({
    summary: 'Add new user',
    description: 'Add new user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add user form-data',
    type: SignUpRequestDto,
  })
  @UseInterceptors(FileInterceptor('avatar', userAvatarStorageConfig))
  @ApiSuccessResponse({ dataType: UserResponseDto })
  async addUser(
    @UploadedFile(new SingleImageFileValidationPipe()) avatar: Express.Multer.File,
    @Body() body: SignUpRequestDto,
  ): Promise<UserResponseDto> {
    return await this.authService.signUp(body, avatar?.filename);
  }

  @Post('generate-otp')
  @ApiOperation({
    summary: 'Creat opt forforgot passwword',
    description: 'Creat opt for forgot passwword',
  })
  async generateOtp(@Body() generateOtpDto: GenerateOtpDto): Promise<void> {
    return this.authService.generateOtp(generateOtpDto.email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out a user' })
  async logOut(@Body() logOutDto: LogOutRequestDto): Promise<void> {
    return this.authService.logOut(logOutDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<string> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
