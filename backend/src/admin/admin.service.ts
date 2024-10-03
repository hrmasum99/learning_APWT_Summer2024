import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { Repository } from "typeorm";
import { AdminProfile } from "./admin.profile";
import { AuthDTO } from "../auth/dto/auth.dto";
import { changePasswordDTO } from "src/auth/dto/chnage-password.dto";
import * as bcrypt from 'bcrypt'; 
import { AdminUpdateDTO } from "./admin.dto";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";

@Injectable()
export class AdminService {
  [x: string]: any;
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>, @InjectRepository(AdminProfile) 
    private readonly adminProfileRepo: Repository<AdminProfile>, @InjectRepository(Event_CoordinatorEntity) 
    private readonly eventCoordinatorRepo: Repository<Event_CoordinatorEntity>,
  ) {}

    findByEmail(email: string) {
      throw new Error('Method not implemented.');
    }

    async getAllAdmin(): Promise<AdminEntity[]> {
        return await this.adminRepo.find();
    }

    async  getAdminById(id:number): Promise<AdminEntity> {
        return await this.adminRepo.findOne({
            where: { id }
        });
    }

    async  getAdminByEmail(email:string): Promise<AdminEntity> {
        return await this.adminRepo.findOne({
            where: {
                email: email,
            }
        });
    }

    async findByIdAndEmail(id?: number, email?: string): Promise<AdminEntity[]> {
      const query = this.adminRepo.createQueryBuilder('admin');
    
      if (id) {
        query.andWhere('admin.id = :id', { id });
      }
      if (email) {
        query.andWhere('admin.email = :email', { email });
      }
    
      return query.getMany();
    }

    async createAdmin(myobj: AuthDTO): Promise<any> {
      
      const userEmail = await this.adminRepo.findOne({where: { email: myobj.email }});
      if (userEmail) {
        throw new BadRequestException('This email is already used!');
      }
      const admin= new AdminEntity();
      admin.email = myobj.email;
      admin.password = myobj.password; 

      const profile = new AdminProfile();
      await this.adminProfileRepo.save(profile);
      console.log("admin create");
      admin.adminProfile = profile;
      console.log("admin profile create");
      return await this.adminRepo.save(admin);
    }

    async findByCredentials(loginDto: AuthDTO): Promise<any> {
      return this.adminRepo.findOne({ where: { email:loginDto.email } });
    }

    // async findLoginData( logindata:LoginDTO): Promise<any> {
    //     return await this.adminRepo.findOneBy({email:logindata.email});
    // }
  
    async getAdminWithProfile(id: number): Promise<AdminEntity> {
      return this.adminRepo.findOne({ where: { id }, relations: ['adminProfile'] });
    }

    async changeAdminPassword(id: number, changePasswordDto: changePasswordDTO): Promise<string> {
      const user = await this.adminRepo.findOne({ where: { id } });
  
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
  
      await this.adminRepo.save(user);
      return 'Password changed successfully';
    }

    // async updatePassword(id: number, newPassword: string): Promise<void> {
    //   await this.adminRepo.update(id, { password: newPassword });
    // }
  
    // async updateAdmin(id: number, adminProfileDto: AdminUpdateDTO): Promise<any> {
    //   // await this.adminRepo.update(id, updatedAdmin);
    //   adminProfile.adminEntity = await this.adminRepo.findOne({ where: { id } });
    //   await this.adminProfileRepo.save(adminProfile);
    //   return this.adminRepo.findOne({ where: { id }, relations: ['adminProfile'] });
    // }

    async updateAdmin(id: number, adminProfileDto: AdminUpdateDTO): Promise<any> {
      const user = await this.adminRepo.findOne({
        where: { id },
        relations: ['adminProfile'],
      });
  
      if (!user) {
        throw new NotFoundException('Admin not found');
      }
  
      // Update AdminEntity fields if needed
      // Example: user.email = adminProfileDto.email; 
  
      // Update AdminProfile fields
      // if (user.adminProfile) {
        user.adminProfile.admin_name = adminProfileDto.admin_name;
        user.adminProfile.admin_NID = adminProfileDto.admin_NID;
        user.adminProfile.admin_phone = adminProfileDto.admin_phone;
        user.adminProfile.admin_gender = adminProfileDto.admin_gender;
  
        // Save updated profile
        await this.adminProfileRepo.save(user.adminProfile);
      // } else {
      //   // Create a new profile if it doesn't exist
      //   const newProfile = this.adminProfileRepo.create(adminProfileDto);
      //   user.adminProfile = newProfile;
      //   await this.adminRepo.save(user);
      // }
  
      return user;
    }

    //event-coordinator

    async addCoordinator(id: number, evt_co: Event_CoordinatorEntity): Promise<Event_CoordinatorEntity> {
      //console.log(id);
      //console.log(manager);
      const admin = await this.adminRepo.findOneBy({id: id});
       evt_co.admin = admin;
      return this.eventCoordinatorRepo.save(evt_co);
  }

  getUsersWithAdmin(): Promise<AdminEntity[]> {
      return this.adminRepo.find({relations: ["users"]});
  }

  getUsersWithid(id: number): Promise<AdminEntity[]> {
      return this.adminRepo.find({relations: ["users"], where:{id:id}});
  }

  getUsersWithAdminEmail(email: string): Promise<AdminEntity[]> {
      return this.adminRepo.find({relations: ["users"], where:{email:email}});
  }

  async getAllAdminsWithCoordinators(): Promise<AdminEntity[]> {
      return this.adminRepo.find({ relations: ['evt_co'],
          select: {
                id: true,
                email: true,
                evt_co: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
       });
  }

  async getCoordinatorById(id: number): Promise<Event_CoordinatorEntity> {
      return this.eventCoordinatorRepo.findOne({ where: { id }, relations: ['admin'], select: {
          admin: {
            id: true,
            email: true,
          },
        }, });
  }
  

  async updateEventCoordinator(
    adminId: number,
    eventCoordinatorId: number,
    updateData: Partial<Event_CoordinatorEntity>,
  ): Promise<Event_CoordinatorEntity> {
    // Check if admin exists
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    // Check if the event coordinator exists
    const eventCoordinator = await this.eventCoordinatorRepo.findOne({
      where: { id: eventCoordinatorId, admin: { id: adminId } },
    });
    if (!eventCoordinator) {
      throw new NotFoundException(`Event Coordinator with ID ${eventCoordinatorId} not found`);
    }

    // Update event coordinator details
    Object.assign(eventCoordinator, updateData);
    
    // Save updated entity
    return this.eventCoordinatorRepo.save(eventCoordinator);
  }


  async deleteCoordinator(id: number): Promise<void> {
      await this.eventCoordinatorRepo.delete(id);
  }

}
