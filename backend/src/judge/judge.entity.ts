import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JudgeProfile } from "./judge.profile";

@Entity("judge")
export class JudgeEntity{
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column({ type: 'varchar', length: 100, unique: true })
   email: string;

   @Column({ type: 'varchar' })
   password: string;

   @OneToOne(() => JudgeProfile, judgeProfile => judgeProfile.judgeEntity, { cascade: true 
   })
    @JoinColumn()
    judgeProfile: JudgeProfile;


}