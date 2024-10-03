import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JudgeEntity } from "./judge.entity";

@Entity("Judge_Profile")
export class JudgeProfile{
@PrimaryGeneratedColumn({name: 'ID'})
judge_PID: number;
@Column({ name: 'Name', type: 'varchar', length: 128, default: 'N/A' })
judge_name: string;
@Column({name: 'NID', length: 17, default: 'N/A'})
judge_NID: string;
// @Column({name: 'DOB', default: 'N/A'})
// admin_DOB: Timestamp;
@Column({ type: 'varchar', name: 'Phone', length: 150, default: 'N/A' })
judge_phone: string;
@Column({type: 'varchar', name: 'Gender',default: 'N/A'})
judge_gender: string;
// @Column()
// admin_filename: string;



@OneToOne(() => JudgeEntity, judgeEntity => judgeEntity.judgeProfile)
judgeEntity: JudgeEntity;
}