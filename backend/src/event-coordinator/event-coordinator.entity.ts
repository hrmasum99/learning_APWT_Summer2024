import { AdminEntity } from "src/admin/admin.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("event-coordinator")
 export class Event_CoordinatorEntity{
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 name: string;
 @Column()
 email: string;
 @Column()
 password: string;
//  @Column()
//   filename: string;


 @ManyToOne(() => AdminEntity, admin => admin.evt_co)
 
admin: AdminEntity;
    eventCoordinatorProfile: any;

 }