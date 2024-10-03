import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { AdminEntity } from "./admin.entity";

@Entity("Admin_Profile")
export class AdminProfile{
@PrimaryGeneratedColumn({name: 'ID'})
admin_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
admin_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
admin_NID: string;
// @Column({name: 'DOB', default: 'N/A'})
// admin_DOB: Timestamp;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
admin_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
admin_gender: string;
// @Column()
// admin_filename: string;



@OneToOne(() => AdminEntity, adminEntity => adminEntity.adminProfile)
adminEntity: AdminEntity;

}
