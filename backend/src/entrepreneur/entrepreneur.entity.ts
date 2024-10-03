import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntrepreneurProfile } from "./entrepreneur.profile";

@Entity("entrepreneur")
export class EntrepreneurEntity{
   @PrimaryGeneratedColumn()
   id: number;
 
   @Column({ type: 'varchar', length: 100, unique: true })
   email: string;

   @Column({ type: 'varchar' })
   password: string;

   @OneToOne(() => EntrepreneurProfile, entrepreneurProfile => entrepreneurProfile.entrepreneurEntity, { cascade: true 
   })
    @JoinColumn()
    entrepreneurProfile: EntrepreneurProfile;
}