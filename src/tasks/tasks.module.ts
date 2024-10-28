import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { TaskAllocationService } from './task-allocation.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Comment]),
    forwardRef(() => UsersModule),
    ScheduleModule.forRoot(),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskAllocationService,],
  exports: [TasksService, TypeOrmModule, TaskAllocationService],
})
export class TasksModule {}
