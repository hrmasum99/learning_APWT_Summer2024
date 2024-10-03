import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JudgeModule } from './judge/judge.module';
import { EntrepreneurModule } from './entrepreneur/entrepreneur.module';
import { Event_CoordinatorEntity } from './event-coordinator/event-coordinator.entity';


@Module({
  imports: [AuthModule, AdminModule, 
    JudgeModule, EntrepreneurModule, 
    TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'cs',//Change to your database name
    autoLoadEntities: true,
    synchronize: true,
    } ),MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'code4ever.masum99@gmail.com',
          pass: 'pers tina ydng xipb',
        },
      },
    }), ],
  controllers: [AppController],
  providers: [AppService],
  //exports: [AppService]
})
export class AppModule {}
