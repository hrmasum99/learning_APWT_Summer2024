import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";
import { Repository } from "typeorm";
import { EntrepreneurProfile } from "./entrepreneur.profile";
import { AuthDTO } from "src/auth/dto/auth.dto";
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class EntrepreneurService {
  constructor(
    @InjectRepository(EntrepreneurEntity)
    private readonly entrepreneurRepo: Repository<EntrepreneurEntity>, 
    @InjectRepository(EntrepreneurProfile) 
    private readonly entrepreneurProfileRepo: Repository<EntrepreneurProfile>,
  ) { }

    // findByEmail(email: string) {
    //   throw new Error('Method not implemented.');
    // }

    async getAllEntrepreneur(): Promise<EntrepreneurEntity[]> {
        return await this.entrepreneurRepo.find();
    }

    async  getEntrepreneurById(id:number): Promise<EntrepreneurEntity> {
        return await this.entrepreneurRepo.findOne({
            where: {
                id: id,
            }
        });
    }

    async  getEntrepreneurByEmail(email:string): Promise<EntrepreneurEntity> {
        return await this.entrepreneurRepo.findOne({
            where: {
                email: email,
            }
        });
    }

    async createEntrepreneur(myobj: AuthDTO): Promise<any> {
      const userEmail = await this.entrepreneurRepo.findOne({where: { email: myobj.email }});
      if (userEmail) {
        throw new BadRequestException('This email is already used!');
      }
      const entrepreneur= new EntrepreneurEntity();
      entrepreneur.email = myobj.email;
      entrepreneur.password = myobj.password; 

      const profile = new EntrepreneurProfile();
      await this.entrepreneurProfileRepo.save(profile);
      
      entrepreneur.entrepreneurProfile = profile;
      return await this.entrepreneurRepo.save(entrepreneur);
    }

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
        return this.entrepreneurRepo.findOne({ where: { email:loginDto.email } });
      }

    async changeEntrepreneurPassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
    const user = await this.entrepreneurRepo.findOne({ where: { id } });

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

    await this.entrepreneurRepo.save(user);
    return 'Password changed successfully';
    }
}