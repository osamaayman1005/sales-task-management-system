import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Not, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TaskStatus } from './enums/task-status.enum';
import { Comment } from './entities/comment.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => UsersService))  // Forward ref to avoid circular dependency
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.save(createTaskDto);
  }

  async findAll() {
    return this.taskRepository.find({ relations: {assignee: true, comments: true} });
  }
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {id},
      relations: {assignee: true}
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

 async assignTaskToSalesAgent(taskId: number, salesAgentId: number): Promise<Task> {
  const task = await this.findOne(taskId);
  const salesAgent = await this.usersService.findOne(salesAgentId);  
  
  if (task.locked) {
    throw new ConflictException('Task is locked and cannot be reassigned');
  }
  if(task.status === TaskStatus.SUCCEEDED){
    throw new ConflictException('Cannot reassign succeeded or closed tasks')
  }
  if(!salesAgent){
    throw new ConflictException('Agent Not Found');
  }
  console.log(salesAgent);
  task.assignee = salesAgent;
  task.status = TaskStatus.IN_PROGRESS;
  task.locked = true;  // Lock the task after assigning
  return await this.taskRepository.save(task);
}

async markTaskAsSucceededOrFailed(taskId: number, status: TaskStatus, commentContent?: string): Promise<Task> {
  const task = await this.findOne(taskId);

  if (task.status === TaskStatus.SUCCEEDED) {
    throw new Error('Task is already closed');
  }
  if(commentContent){
    this.commentRepository.save(new Comment({content: commentContent, task: task, user: task.assignee}))
  }
  task.status = status;
  task.locked = status === TaskStatus.SUCCEEDED; //in case the the task successded, it should't be reassigned 
  return await this.taskRepository.save(task);
}

// Fetch the task(s) for a specific Sales Agent
async getSalesAgentTask(salesAgentId: number): Promise<Task> {
  const task = await this.taskRepository.findOne({ where: { assignee: {id: salesAgentId} }
    ,order: {priority: 'DESC', createdAt: 'ASC'}, relations: {comments: true}});
    task.status = TaskStatus.IN_PROGRESS;
    task.locked = true;  // Lock the task after assigning
    await this.taskRepository.save(task);
    return task;
}

async unlockTask(taskId: number): Promise<Task> {
  const task = await this.findOne(taskId);
  if(task.status === TaskStatus.SUCCEEDED){
    throw new ConflictException('Cannot unlock succeeded task');
  }
  task.locked = false;
  return this.taskRepository.save(task);
}

async getAssignableTasks(): Promise<Task[]>{
  return await this.taskRepository.find(
    {where: {status: Not(TaskStatus.SUCCEEDED), locked: false},
   order: {priority: 'DESC', createdAt: 'ASC'}})
}

}
