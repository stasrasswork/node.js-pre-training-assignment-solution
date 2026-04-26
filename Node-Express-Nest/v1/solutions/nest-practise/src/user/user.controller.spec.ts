import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthPipe } from '../auth/auth.pipe';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { LoggerService } from '../logger/logger.service';

describe('UserController', () => {
  let controller: UserController;

  const userServiceMock = {
    getUsers: jest.fn(),
  };

  const authGuardMock = {
    canActivate: jest.fn(() => true),
  };

  const authPipeMock = {
    transform: jest.fn((value: unknown) => value),
  };

  const authInterceptorMock = {
    intercept: jest.fn(),
  };

  const loggerServiceMock = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: AuthGuard,
          useValue: authGuardMock,
        },
        {
          provide: AuthPipe,
          useValue: authPipeMock,
        },
        {
          provide: AuthInterceptor,
          useValue: authInterceptorMock,
        },
        {
          provide: LoggerService,
          useValue: loggerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('should return users', () => {
    userServiceMock.getUsers.mockReturnValue([{ id: 1, name: 'John', email: 'john@example.com', password: 'password' }, { id: 2, name: 'Jane', email: 'jane@example.com', password: 'password' }, { id: 3, name: 'Jim', email: 'jim@example.com', password: 'password' }, { id: 4, name: 'Jill', email: 'jill@example.com', password: 'password' }]);
    expect(controller.getUsers()).toEqual([{ id: 1, name: 'John', email: 'john@example.com', password: 'password' }, { id: 2, name: 'Jane', email: 'jane@example.com', password: 'password' }, { id: 3, name: 'Jim', email: 'jim@example.com', password: 'password' }, { id: 4, name: 'Jill', email: 'jill@example.com', password: 'password' }]);
  });
});
