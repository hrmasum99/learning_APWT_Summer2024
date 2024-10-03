import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JudgeEntity } from "./judge.entity";
import { JudgeProfile } from "./judge.profile";
import { JudgeService } from "./judge.service";
import { JudgeController } from "./judge.controller";


@Module({
    imports: [TypeOrmModule.forFeature(
              [JudgeEntity, JudgeProfile,]),],
    controllers: [JudgeController],
    providers: [JudgeService],
    exports: [JudgeService],
  })
  export class JudgeModule {}