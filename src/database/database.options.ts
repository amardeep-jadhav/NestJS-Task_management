import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class DatabaseOptions implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      entities: [Task],
    };
  }
}
