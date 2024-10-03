import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";

@Entity("Entrepreneur_Profile")
export class EntrepreneurProfile{
@PrimaryGeneratedColumn({name: 'ID'})
entrepreneur_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
entrepreneur_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
entrepreneur_NID: string;
// @Column({name: 'DOB', default: 'N/A'})
// admin_DOB: Timestamp;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
entrepreneur_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
entrepreneur_gender: string;
// @Column()
// admin_filename: string;


@OneToOne(() => EntrepreneurEntity, entrepreneurEntity => entrepreneurEntity.entrepreneurProfile)
entrepreneurEntity: EntrepreneurEntity;
}