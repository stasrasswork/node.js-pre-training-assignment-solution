import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getAudit() {
    return this.auditService.getAudit();
  }

  @Get('user/:id')
  getUserAudit(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.getUserAudit(id);
  }

  @Get('users')
  getUsers() {
    return this.auditService.getUsers();
  }
}
