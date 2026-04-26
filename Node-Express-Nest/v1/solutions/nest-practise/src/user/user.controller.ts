import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPipe } from '../auth/auth.pipe';
import { AuthInterceptor } from '../auth/auth.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Get('email/:email')
  getUserByEmail(@Param('email', AuthPipe) email: string) {
    return this.userService.getUserByEmail(email);
  }
}
