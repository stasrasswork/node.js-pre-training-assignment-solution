import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { UserService } from '../user/user.service';

describe('AuditService', () => {
  let service: AuditService;

  const userServiceMock = {
    getUsers: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUsers should delegate to UserService', () => {
    userServiceMock.getUsers.mockReturnValue([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }, { id: 4, name: 'David' }]);
    
    const result = service.getUsers();
    
    expect(result).toEqual([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }, { id: 4, name: 'David' }]);
    expect(userServiceMock.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should return empty array by default', () => {
    userServiceMock.getUsers.mockReturnValue([]);
    expect(service.getUsers()).toEqual([]);
  });
  
});
