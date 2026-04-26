import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { LoggerModule } from '../logger/logger.module';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPipe } from '../auth/auth.pipe';
import { AuthInterceptor } from '../auth/auth.interceptor';

@Module({
  imports: [LoggerModule],
  providers: [UserService, AuthGuard, AuthPipe, AuthInterceptor],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
