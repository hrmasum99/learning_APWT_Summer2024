import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JudgeEntity } from "./judge.entity";
import { Repository } from "typeorm";
import { JudgeProfile } from "./judge.profile";
import { AuthDTO } from "src/auth/dto/auth.dto";
import * as bcrypt from 'bcrypt'; 
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";

@Injectable()
export class JudgeService {
  constructor(
    @InjectRepository(JudgeEntity)
    private readonly judgeRepo: Repository<JudgeEntity>, @InjectRepository(JudgeProfile) 
    private readonly judgeProfileRepo: Repository<JudgeProfile>,
  ) { }

    // findByEmail(email: string) {
    //   throw new Error('Method not implemented.');
    // }

    async getAllJudge(): Promise<JudgeEntity[]> {
        return await this.judgeRepo.find();
    }

    async  getJudgeById(id:number): Promise<JudgeEntity> {
        return await this.judgeRepo.findOne({
            where: {
                id: id,
            }
        });
    }

    async  getJudgeByEmail(email:string): Promise<JudgeEntity> {
        return await this.judgeRepo.findOne({
            where: {
                email: email,
            }
        });
    }

    async createJudge(myobj: AuthDTO): Promise<any> {
      const userEmail = await this.judgeRepo.findOne({where: { email: myobj.email }});
      if (userEmail) {
        throw new BadRequestException('This email is already used!');
      }
      const judge= new JudgeEntity();
      judge.email = myobj.email;
      judge.password = myobj.password; 

      const profile = new JudgeProfile();
      await this.judgeProfileRepo.save(profile);
      
      judge.judgeProfile = profile;
      return await this.judgeRepo.save(judge);
    }

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
        return this.judgeRepo.findOne({ where: { email:loginDto.email } });
    }

    async changeJudgePassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
    const user = await this.judgeRepo.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(changePasswordDto.oldpassword, user.password);
    if (!isMatch) {
        throw new BadRequestException('Old password does not match');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.newpassword, salt);
    user.password = hashedPassword;

    await this.judgeRepo.save(user);
    return 'Password changed successfully';
    }
}