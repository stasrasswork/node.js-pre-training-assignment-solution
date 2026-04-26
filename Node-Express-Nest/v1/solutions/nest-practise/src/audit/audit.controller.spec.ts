import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController', () => {
  let controller: AuditController;

  const auditServiceMock = {
    getAudit: jest.fn(),
    getUserAudit: jest.fn(),
    getUsers: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: auditServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all audits', () => {
    const audits = [{ id: 1, userId: 1, action: 'create', timestamp: new Date() }];
    
    auditServiceMock.getAudit.mockReturnValue(audits);
    const result = controller.getAudit();
    
    expect(result).toEqual(audits);
    expect(auditServiceMock.getAudit).toHaveBeenCalledTimes(1);
  });

  it('should return audit by user id', () => {
    const audit = { id: 1, userId: 1, action: 'create', timestamp: new Date() };
    auditServiceMock.getUserAudit.mockReturnValue(audit);
    
    const result = controller.getUserAudit(1);
    
    expect(result).toEqual(audit);
    expect(auditServiceMock.getUserAudit).toHaveBeenCalledTimes(1);
  });

  it('should return empty array if no audit found', () => {
    auditServiceMock.getUserAudit.mockReturnValue([]);
    const result = controller.getUserAudit(1);
    expect(result).toEqual([]);
    expect(auditServiceMock.getUserAudit).toHaveBeenCalledTimes(1);
  });

  it('should return users', () => {
    const users = [{ id: 1, name: 'John' }];
    auditServiceMock.getUsers.mockReturnValue(users);
    
    const result = controller.getUsers();
    
    expect(result).toEqual(users);
    expect(auditServiceMock.getUsers).toHaveBeenCalledTimes(1);
  });
});
