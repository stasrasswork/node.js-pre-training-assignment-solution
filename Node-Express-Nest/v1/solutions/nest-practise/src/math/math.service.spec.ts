import { Test, TestingModule } from '@nestjs/testing';
import { MathService } from './math.service';
import { LoggerService } from '../logger/logger.service';

describe('MathService', () => {
  let service: MathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MathService,
        {
          provide: LoggerService,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MathService>(MathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
