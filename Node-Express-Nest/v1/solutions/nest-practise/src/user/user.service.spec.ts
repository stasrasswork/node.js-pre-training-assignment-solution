import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { LoggerService } from '../logger/logger.service';

describe('UserService', () => {
  let service: UserService;

  const loggerServiceMock = {
    log: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: LoggerService,
          useValue: loggerServiceMock,
        },
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should return users list', () => {
    const result = service.getUsers();
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(Promise),
      }),
    ]));
  });

  it('should call logger', () => {
    service.getUsers();
    expect(loggerServiceMock.log).toHaveBeenCalledWith('Getting users');
  });
});
