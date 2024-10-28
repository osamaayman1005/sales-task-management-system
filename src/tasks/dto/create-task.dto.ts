import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  contactInfo: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
