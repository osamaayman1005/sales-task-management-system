import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskAllocationService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async allocateTasks() {
    console.log('Starting task allocation...');
    // Fetch unassigned tasks, ordered by priority
    const tasks = await this.tasksService.getAssignableTasks();

    // Fetch all logged-in Sales Agents, ordered by success rate (via native query)
    const salesAgents = await this.usersService.getLoggedInSalesAgentsBySuccessRate();

    if (salesAgents.length === 0) {
      console.log('No logged-in Sales Agents available for task allocation');
      return;
    }

    for (const task of tasks) {
      // Find the next available Sales Agent
      const availableAgent = salesAgents.shift();

      // Assign the task to the Sales Agent
      await this.tasksService.assignTaskToSalesAgent(task.id, availableAgent.id);

      // Re-add the Sales Agent at the end of the list (round-robin assignment)
      salesAgents.push(availableAgent);
    }

    console.log('Tasks have been allocated successfully');
  }
}
