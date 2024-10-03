import { Module } from "@nestjs/common"; 
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { AdminModule } from "src/admin/admin.module";
import { JudgeModule } from "src/judge/judge.module";
import { EntrepreneurModule } from "src/entrepreneur/entrepreneur.module";

@Module({
    // imports: [
    //   TypeOrmModule.forFeature([AdminEntity, AdminProfile, JudgeEntity, JudgeProfile, EntrepreneurEntity, EntrepreneurProfile]),PassportModule,
    //   JwtModule.register({
    //     global: true,
    //     secret: jwtConstants.secret,
    //     signOptions: { expiresIn: '10h' },
    //   }), 
    // ],
    // providers: [AuthService, JwtStrategy, AdminService,
    //   JudgeService,
    //   EntrepreneurService,
    //   MailerService,],
    // controllers: [AuthController],

    imports: [
      AdminModule,
      JudgeModule,
      EntrepreneurModule,
      PassportModule,
      JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '10h' },
      }),
    ],
    providers: [AuthService, 
      JwtStrategy
    ],
    controllers: [AuthController],

     //exports: [AuthService],
  })
  export class AuthModule {}