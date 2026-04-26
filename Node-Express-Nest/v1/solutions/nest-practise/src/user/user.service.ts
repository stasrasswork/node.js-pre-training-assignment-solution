import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import * as bcrypt from 'bcrypt';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(private readonly loggerService: LoggerService) {}
  
  private readonly users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', password: 'password2' }, 
    { id: 2, name: 'Bob', email: 'bob@example.com', password: 'password12' }, 
    { id: 3, name: 'Charlie', email: 'charlie@example.com', password: 'password1235' }, 
    { id: 4, name: 'David', email: 'david@example.com', password: 'password136' }
  ];

  getUsers(): User[] {
    this.loggerService.log('Getting users');
    const hashedUsers = this.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: bcrypt.hash(user.password, 10),
    }));
    return hashedUsers;
  }

  getUser(id: number): User {
    this.loggerService.log(`Getting user ${id}`);
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  getUserByEmail(email: string): User {
    this.loggerService.log(`Getting user by email ${email}`);
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
