import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminProfile } from "./admin.profile";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";

 @Entity("admin")
 export class AdminEntity{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @OneToOne(() => AdminProfile, adminProfile => adminProfile.adminEntity, { cascade: true 
    })
     @JoinColumn()
     adminProfile: AdminProfile;

    @OneToMany(() => Event_CoordinatorEntity, evt_co => evt_co.admin)
    evt_co: Event_CoordinatorEntity[];

 }
