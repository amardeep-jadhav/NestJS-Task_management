import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { TaskRepository } from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmExModule.forCustomRepository([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
