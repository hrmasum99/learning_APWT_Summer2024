
import { Body, Controller, Post, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import * as bcrypt from 'bcrypt';   
import { AuthService } from './auth.service';
import { changePasswordDTO } from './dto/chnage-password.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  tokenBlacklistService: any;
  constructor(
    private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe)
    async signup(@Body() authDto:AuthDTO): Promise<AuthDTO> {
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(authDto.password, salt);
      authDto.password= hashedpassword;
      return this.authService.signup(authDto.role, authDto);
    }

    // @Post('signup/admin')
    // @UsePipes(new ValidationPipe)
    // async signUpAdmin(@Body() myobj: AdminDTO): Promise<AdminDTO> {
      
    //   const salt = await bcrypt.genSalt();
    //   const hashedpassword = await bcrypt.hash(myobj.password, salt); 
    //   myobj.password= hashedpassword;
    //     return this.authService.signUpAdmin(myobj);
    // }

    // @Post('signup')
    // @UsePipes(new ValidationPipe)
    // // async signup(@Body() authDto: AuthDTO, role:string)//: Promise<AuthDTO> 
    // async signup(@Body() authDto: AuthDTO, role:string)
    // {
    //   // const salt = await bcrypt.genSalt();
    //   // const hashedpassword = await bcrypt.hash(authDto.password, salt); 
    //   // authDto.password= hashedpassword;
    //   return this.authService.signup(authDto, role);
    // }

    // @Post('signup/entrepreneur')
    // @UsePipes(new ValidationPipe)
    // async signUpEntrepreneuer(@Body() myobj: EntrepreneurDTO): Promise<EntrepreneurDTO> {
      
    //   const salt = await bcrypt.genSalt();
    //   const hashedpassword = await bcrypt.hash(myobj.password, salt); 
    //   myobj.password= hashedpassword;
    //     return this.authService.signUpEntrepreneur(myobj);
    // }

    // @Post('signup/judge')
    // @UsePipes(new ValidationPipe)
    // async signUpJudge(@Body() myobj: JudgeDTO): Promise<JudgeDTO> {
      
    //   const salt = await bcrypt.genSalt();
    //   const hashedpassword = await bcrypt.hash(myobj.password, salt); 
    //   myobj.password= hashedpassword;
    //     return this.authService.signUpJudge(myobj);
    // }

    // @Post('login')
    // async login(@Body() logindto: LoginDTO) {
    //   const user = await this.authService.validateUser(loginDto);
    //   if (!user) {
    //     throw new UnauthorizedException('Invalid credentials!!!');
    //   }
    //   return this.authService.login(user);
    // }

    @Post('login')
    @UsePipes(new ValidationPipe)
    async login(@Body() loginDto: AuthDTO): Promise<any> 
    {
      const user = await this.authService.validateUser( loginDto.role, loginDto);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials!!!');
      }
       return this.authService.login(user, loginDto.role);
    }

    @Post('logout')
    logout(@Req() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing from Authorization header');
    }

    this.tokenBlacklistService.blacklistToken(token);
    // Invalidate the session or do other cleanup
    return { message: 'Logout successful' };
    }

    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe)
    @Post('change-password')
    async changePassword(@Req() req, @Body() changePasswordDto: changePasswordDTO): Promise<string> {
      const user = req.user; 
      return this.authService.changePassword(user.role, user.id, changePasswordDto);
    }
  
    // @Post('send-forgot-password-otp')
    // @UsePipes(new ValidationPipe())
    // async sendForgotPasswordOTP(@Body('email') email: string) {
    //   return this.authService.sendForgotPasswordOTP(email);
    // }

    // @Post('forgot-password')
    // @UsePipes(new ValidationPipe())
    // async forgotPassword(@Body() forgotPasswordData: { email: string, otp: string, newPassword: string }) {
    //   return this.authService.forgotPassword(forgotPasswordData);
    // }

    // @UseGuards(AuthGuard)
    // @Post('change-password/admin')
    // async changeAdminPassword(
    //   @Request() req, 
    //   @Body() changePasswordDto: changePasswordDTO) {
    //     const adminId = req.user.sub;
    //     await this.authService.changeAdminPassword(adminId, changePasswordDto.oldpassword, changePasswordDto.newpassword);
    //     return { message: 'Password changed successfully.' };
    // }

    // @UseGuards(AuthGuard)
    // @Post('change-password/entrepreneur')
    // async changeEntrepreneurPassword(
    //   @Request() req, 
    //   @Body() changePasswordDto: changePasswordDTO) {
    //     const entrepreneurId = req.user.sub;
    //     await this.authService.changeEntrepreneurPassword(entrepreneurId, changePasswordDto.oldpassword, changePasswordDto.newpassword);
    //     return { message: 'Password changed successfully.' };
    // }

    // @UseGuards(AuthGuard)
    // @Post('change-password/judge')
    // async changeJudgePassword(
    //   @Request() req, 
    //   @Body() changePasswordDto: changePasswordDTO) {
    //     const judgeId = req.user.sub;
    //     await this.authService.changeJudgePassword(judgeId, changePasswordDto.oldpassword, changePasswordDto.newpassword);
    //     return { message: 'Password changed successfully.' };
    // }
}
