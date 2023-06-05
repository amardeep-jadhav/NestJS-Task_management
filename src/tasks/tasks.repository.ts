import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GettaskFilerDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {
  //get all tasks with filter
  async getTasks(filterDto: GettaskFilerDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status= :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  //Create Task
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.DONE,
      user,
    });

    await this.save(task);
    return task;
  }
}
