import {  BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../admin/admin.service";
import * as bcrypt from 'bcrypt';   
import { AuthDTO } from "./dto/auth.dto";
import { Repository } from "typeorm";
import { JudgeService } from "../judge/judge.service";
import { EntrepreneurService } from "../entrepreneur/entrepreneur.service";
import { changePasswordDTO } from "./dto/chnage-password.dto";


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly judgeService: JudgeService,
    private readonly entrepreneurService: EntrepreneurService,
    private readonly jwtService: JwtService,
    //private readonly redisService: RedisService
  ) {}

  async signup(role: string, authDto: AuthDTO, ): Promise<any> 
  {
    //const { email, password } = authDto;
    if (role == 'admin') {
      return await this.adminService.createAdmin(authDto);
    } else if (role == 'judge') {
      return await this.judgeService.createJudge(authDto);
    } else if (role == 'entrepreneur') {
      return await this.entrepreneurService.createEntrepreneur(authDto);
    }
  }

  // private async createUser(repository: Repository<any>, email: string, password: string) {
  //   const salt = await bcrypt.genSalt();
  //   const hashedpassword = await bcrypt.hash(password, salt); 
  //   const newUser = repository.create({ email, password: hashedpassword });
  //   return repository.save(newUser);
  // }

  async validateUser(role: string, loginDto: AuthDTO): Promise<any> 
  {
    //const {role} loginDto;
    let user;
    if (role=='admin') {
        user = await this.adminService.findByCredentials(loginDto);
        if (user && await bcrypt.compare(loginDto.password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
      } else if(role=='judge') {
        user = await this.judgeService.findByCredentials(loginDto);
        if (user && await bcrypt.compare(loginDto.password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
      } else if(role=='entrepreneur'){
        user = await this.entrepreneurService.findByCredentials(loginDto);
        if (user && await bcrypt.compare(loginDto.password, user.password)) {
          const { password, ...result } = user;
          return result;
        }  
      }
    return null;
  }

  async login(user: any, role: string) {
    const payload = { email: user.email, sub: user.id, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(role: string, id: number, changePasswordDto: changePasswordDTO): Promise<string> {
    // console.log('User role:', role);
    // console.log('User ID:', id);
    
    if (role === 'admin') {
      return await this.adminService.changeAdminPassword(id, changePasswordDto);
    } else if (role === 'judge') {
      return await this.judgeService.changeJudgePassword(id, changePasswordDto);
    } else if (role === 'entrepreneur') {
      return await this.entrepreneurService.changeEntrepreneurPassword(id, changePasswordDto);
    } else {
      throw new BadRequestException('Invalid user role');
    }
  }

  // private login(user: any, role: string) {
  //   const payload = { email: user.email, sub: user.id, role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // private otpStore = {};

  // async signUpAdmin(myobj: AdminDTO): Promise<AdminDTO> {
  //   return await this.adminService.createAdmin(myobj);
  // }

//   async signUpEventCoordinator(myobj: AdminDTO): Promise<AdminDTO> {
//     return await this.adminService.createAdmin(myobj);
//   }

//   async signUpEntrepreneur(myobj: EntrepreneurDTO): Promise<EntrepreneurDTO> {
//     return await this.entrepreneurService.createEntrepreneur(myobj);
//   }

//   async signUpJudge(myobj: JudgeDTO): Promise<JudgeDTO> {
//     return await this.judgeService.createJudge(myobj);
//   }


  // async validateUser(logindata:LoginDTO): Promise<any> {
  //   if (logindata.category == "Admin") {
  //     const user = await this.adminService.findLoginData(logindata);
  //     if (user && await bcrypt.compare(logindata.password, user.password)) {
  //       const { password, ...result } = user;
  //       return result;
  //     }
    // } else if (logindata.category == "Event-Coordinator") {
    //   const user = await this.eventCoordinatorService.findLoginData(logindata);
    //   if (user && await bcrypt.compare(logindata.password, user.password)) {
    //     const { password, ...result } = user;
    //     return result;
    //   }
    // } else if (logindata.category == "Entrepreneur") {
    //   const user = await this.entrepreneurService.findLoginData(logindata);
    //   if (user && await bcrypt.compare(logindata.password, user.password)) {
    //     const { password, ...result } = user;
    //     return result;
    //   }
    // } else if (logindata.category == "Judge") {
    //   const user = await this.judgeService.findLoginData(logindata);
    //   if (user && await bcrypt.compare(logindata.password, user.password)) {
    //     const { password, ...result } = user;
    //     return result;
    //   }
  //   }
  //   return null;
  // }

  // async login(user: any) {
  //   const payload = { email: user, sub: user};
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  
  // async sendForgotPasswordOTP(email: string) {
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   this.otpStore[email] = otp;
  //   try {
  //     await this.mailerService.sendMail({
  //       to: email,
  //       subject: 'Password Reset OTP',
  //       text: `Your OTP for password reset is: ${otp}`,
  //     });
      
  //     console.log(`OTP sent to ${email}: ${otp}`);
  //     return true;
  //   } catch (error) {
  //     console.error(`Failed to send OTP to ${email}:`, error.message);
  //     throw new Error(`Failed to send OTP to ${email}`);
  //   }
    
  // }

  // async forgotPassword(resetPasswordData: { email: string, otp: string, newPassword: string }) {
  //   const { email, otp, newPassword } = resetPasswordData;
  //   //const otp = '123456'; // Example stored OTP (replace with actual OTP validation logic)

  //   if (this.otpStore[email] !== otp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   // Remove OTP after verification
  //   delete this.otpStore[email];

  //   // Hash the new password
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(newPassword, salt);

  //   // Update password in database
  //   const admin = await this.adminService.getAdminByEmail(email);
  //   if (!admin) {
  //     throw new UnauthorizedException('User not found');
  //   }
  //   admin.password = hashedPassword;
  //   await this.adminService.updateAdmin(admin.id, admin, null); // Assuming updateAdmin can handle this

  //   return { message: 'Password reset successful' };
  // }

    // async changeAdminPassword(adminId: number, oldpassword: string, newpassword: string)//: Promise<void> 
    // {
    //   const user = await this.adminService.getAdminById(adminId);
  
    //   if (!user || !(await bcrypt.compare(oldpassword, user.password))) {
    //     throw new UnauthorizedException('Old password does not match!!!');
    //   }
  
    //   const salt = await bcrypt.genSalt();
    //   const newhashedpassword = await bcrypt.hash(newpassword, salt); 
    //   //user.password= newhashedpassword;
    //   await this.adminService.updatePassword(adminId, newhashedpassword);
    // }

    // async changeEntrepreneurPassword(enrepreneurId: number, oldpassword: string, newpassword: string): Promise<void> {
    //   const user = await this.entrepreneurService.getEntrepreneurById(enrepreneurId);
  
    //   if (!user || !(await bcrypt.compare(oldpassword, user.password))) {
    //     throw new UnauthorizedException('Old password does not match!!!');
    //   }
  
    //   const salt = await bcrypt.genSalt();
    //   const newhashedpassword = await bcrypt.hash(newpassword, salt); 
    //   //user.password= newhashedpassword;
    //   await this.adminService.updatePassword(enrepreneurId, newhashedpassword);
    // }

    // async changeJudgePassword(adminId: number, oldpassword: string, newpassword: string): Promise<void> {
    //   const user = await this.adminService.getAdminById(adminId);
  
    //   if (!user || !(await bcrypt.compare(oldpassword, user.password))) {
    //     throw new UnauthorizedException('Old password does not match!!!');
    //   }
  
    //   const salt = await bcrypt.genSalt();
    //   const newhashedpassword = await bcrypt.hash(newpassword, salt); 
    //   //user.password= newhashedpassword;
    //   await this.adminService.updatePassword(adminId, newhashedpassword);
    // }
}