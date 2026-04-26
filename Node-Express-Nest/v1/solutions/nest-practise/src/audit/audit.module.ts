import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuditService],
  controllers: [AuditController],
})
export class AuditModule {}
