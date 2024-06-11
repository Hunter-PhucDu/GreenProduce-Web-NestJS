import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginRequestDto,
  LogOutRequestDto,
  RefreshTokenRequestDto,
  SignUpRequestDto,
} from './dtos/request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'modules/shared/models/user.model';
import { AdminModel } from 'modules/shared/models/admin.model';
import { ConfigService } from '@nestjs/config';
import { ERole } from 'modules/shared/enums/auth.enum';
import { CartModel } from 'modules/shared/models/cart.model';
import { MailerService } from '@nestjs-modules/mailer';
import { UserResponseDto } from 'modules/user/dtos/response.dto';
import { plainToClass } from 'class-transformer';
import { SignUpResponseDto } from './dtos/response.dto';
import { authenticator } from 'otplib';
import { OtpModel } from 'modules/shared/models/otp.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userModel: UserModel,
    private readonly adminModel: AdminModel,
    private readonly configService: ConfigService,
    private readonly cartModel: CartModel,
    private readonly otpModel: OtpModel,
    private readonly mailerService: MailerService,
  ) {}

  async onModuleInit() {
    const countAdmins = await this.adminModel.model.countDocuments();

    if (countAdmins <= 0) {
      const password = this.configService.get('admin.password');
      const createdAdmin = new this.adminModel.model({
        username: this.configService.get('admin.username'),
        password: await this.hashPassword(password),
        role: ERole.ADMIN,
      });

      await createdAdmin.save();
    }
  }

  async generateTokens(_id: string, username: string, role: string): Promise<string> {
    return await this.jwtService.signAsync({ _id, username, role });
  }

  async refreshToken(refreshTokenDto: RefreshTokenRequestDto): Promise<string> {
    const { refreshToken } = refreshTokenDto;
    const user = await this.userModel.model.findOne({ refreshToken });

    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    const payload = this.jwtService.verify(refreshToken);
    const newAccessToken = this.jwtService.sign({ _id: payload._id, role: payload.role });

    return newAccessToken;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async _sendMailConfirmation(email: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Nông Sản Green',
        address: 'nongsangreentb@gmail.com',
      },
      subject: 'Chào mừng đến với Nông sản Green',
      html: `
      <table style="font-family: Google Sans, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif; max-width: 600px; width: 100%; margin: 0 auto; padding: 20px; border: 1px solid #dadce0; border-radius: 8px;">
      <tbody>
          <tr>
              <td style="text-align: center;">
                  <img src="https://lh3.googleusercontent.com/a/ACg8ocKC9Lcvx5inst9kEBSlBvICjZ7veh4M4xvBqtTORI1vRaZ8BCg=s96-c-rg-br100"
                      width="100" height="100" aria-hidden="true" style="margin-bottom: 16px; border-radius: 50%;" alt="Google">
                  <h1 style="font-size: 24px; margin: 0;">Nông sản Green</h1>
              </td>
          </tr>
          <tr>
              <td>
                  <p style="font-size: 18px;">Xin chào <strong>${fullName}</strong>,</p>
                  <p>Chúc mừng bạn đã đăng ký thành công tài khoản của <b>Nông sản Green</b>. Chúc bạn
                      có những trải nhiệm thật vui vẻ.</p>
                  <p>Bạn đã sẵn sàng để khám phá và tận hưởng tất cả các dịch vụ mà
                      chúng tôi cung cấp. Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với bộ
                      phận hỗ trợ khách hàng của chúng tôi.</p>
                  <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi.</p>
                  <p style="text-align: right; font-weight: bold;">Trân trọng,<br>
                      Nông sản Green</p>
                  <p>Mọi thắc mắc xin liên hệ: <b>nongsangreentb@gmail.com</b></p>
              </td>
          </tr>
      </tbody>
  </table>`,
    });
  }

  async generateOtp(email: string): Promise<void> {
    const user = await this.userModel.model.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const otp = authenticator.generate(this.configService.get('OTP_SECRET')).slice(0, 6);

    const otpDoc = new this.otpModel.model({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await otpDoc.save();

    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Nông Sản Green',
        address: 'nongsangreentb@gmail.com',
      },
      subject: 'Mã OTP',
      html: `<p>Mã OTP của bạn là <b> ${otp} </b>. Mã OTP sẽ hết hạn sau 5 phút. Lưu lý: tuyệt đối không cung cấp OTP cho bất cứ ai vì bất cứ lý do nào.</p>`,
    });
  }

  async login(loginDto: LoginRequestDto): Promise<{ accessToken: string }> {
    const userToken = await this._userLogin(loginDto);
    if (userToken) return { accessToken: userToken.accessToken };

    const adminToken = await this._adminLogin(loginDto);
    if (adminToken) return { accessToken: adminToken.accessToken };

    throw new BadRequestException('Username or password is incorrect.');
  }

  async _userLogin(loginDto: LoginRequestDto): Promise<{ accessToken: string }> {
    const user = await this.userModel.model.findOne({
      $or: [{ userName: loginDto.username }, { email: loginDto.username }],
    });
    if (!user) return null;

    const checkPw = await this.checkPassword(loginDto.password, user.password);
    if (!checkPw) return null;

    const accessToken = await this.generateTokens(user._id, user.email, user.role);
    return { accessToken };
  }

  async _adminLogin(loginDto: LoginRequestDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    const adminDoc = await this.adminModel.model.findOne({
      username,
    });
    if (!adminDoc) return null;

    const checkPw = await this.checkPassword(password, adminDoc.password);
    if (!checkPw) return null;

    const accessToken = await this.generateTokens(adminDoc._id, username, adminDoc.role);
    return { accessToken };
  }

  async logOut(logOutDto: LogOutRequestDto): Promise<void> {
    const { _id } = logOutDto;
    await this.userModel.model.findByIdAndUpdate(_id, { refreshToken: null });
  }

  async signUp(signupDto: SignUpRequestDto, avatar: string): Promise<SignUpResponseDto> {
    try {
      const { userName, fullName, email, phone, password } = signupDto;
      const existedUser = await this.userModel.model.findOne({
        $or: [{ userName }, { phone }, { email }],
      });

      if (existedUser) {
        throw new BadRequestException('UserName, Email or phone number has been registered.');
      }

      const hashedPw = await this.hashPassword(password);
      await this._sendMailConfirmation(email, fullName);

      const newUser = await this.userModel.save({
        ...signupDto,
        avatar,
        password: hashedPw,
        role: ERole.USER,
      });
      await this.cartModel.save({ owner: newUser._id });
      return plainToClass(UserResponseDto, newUser.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while sign up: ${error.message}`);
    }
  }

  async forgotPassword(forgotPwDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userModel.model.findOne({ email: forgotPwDto.email });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const otpDoc = await this.otpModel.model.findOne({ userId: user._id, otp: forgotPwDto.otp });

    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const hashedPw = await this.hashPassword(forgotPwDto.newPassword);
    await this.userModel.model.findOneAndUpdate({ _id: user._id }, { password: hashedPw }, { new: true });

    await this.otpModel.model.deleteOne({ _id: otpDoc._id }); // delete otp
  }
}
