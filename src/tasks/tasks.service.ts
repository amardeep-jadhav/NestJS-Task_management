import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GettaskFilerDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  //Get Task by Id
  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Task with id:${id} Not Found`);
    }

    return task;
  }

  //Create Task
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  //Delete Task
  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with Id: ${id} Not found`);
    }
  }

  //update task
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    this.taskRepository.save(task);
    return task;
  }

  //get all tasks with filter
  async getTasks(filterDto: GettaskFilerDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
}
