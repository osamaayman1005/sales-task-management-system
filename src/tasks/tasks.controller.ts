import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user.role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  // Create a task (used by Lead Generator)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.LEAD_GENERATOR)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)  
  @Patch(':id/assign')
  assignTask(@Param('id') taskId: string, @Body('agentId') saleAgentId: number) {
    return this.tasksService.assignTaskToSalesAgent(+taskId, saleAgentId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SALES_AGENT)
  @Patch(':id/complete')
  completeTask(@Param('id') taskId: string, @Body('status') status: TaskStatus, @Body('comment') commentContent?: string) {
    return this.tasksService.markTaskAsSucceededOrFailed(+taskId, status, commentContent);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SALES_AGENT)
  @Get('current-task')
  getTasksForSalesAgent(@Request() req) {
    const userId = req.user.id; // Get the user ID from the JWT token
    return this.tasksService.getSalesAgentTask(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)  
  @Patch(':id/unlock')
  unlockTask(@Param('id') taskId: string) {
    return this.tasksService.unlockTask(+taskId);
  }
}
