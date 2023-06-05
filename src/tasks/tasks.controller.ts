import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GettaskFilerDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    console.log(id);
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Get()
  async getTasks(
    @Query() filterDto: GettaskFilerDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterDto, user);
  }
}
