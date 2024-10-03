import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntrepreneurEntity } from "./entrepreneur.entity";
import { EntrepreneurProfile } from "./entrepreneur.profile";
import { EntrepreneurService } from "./entrepreneur.service";
import { EntrepreneurController } from "./entrepreneur.controller";

@Module({
    imports: [TypeOrmModule.forFeature(
              [EntrepreneurEntity, EntrepreneurProfile,]),],
    controllers: [EntrepreneurController],
    providers: [EntrepreneurService],
    exports: [EntrepreneurService],
  })
  export class EntrepreneurModule {}