import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminProfile } from "./admin.profile";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Event_CoordinatorEntity } from "src/event-coordinator/event-coordinator.entity";


@Module({
    imports: [TypeOrmModule.forFeature(
              [AdminEntity, AdminProfile,Event_CoordinatorEntity,]),],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
  })
  export class AdminModule {}