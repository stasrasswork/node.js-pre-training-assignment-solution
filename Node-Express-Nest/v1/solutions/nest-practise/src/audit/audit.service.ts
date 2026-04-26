import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

type Audit = {
  id: number;
  userId: number;
  action: string;
  timestamp: Date;
};

@Injectable()
export class AuditService {
  private readonly audits: Audit[] = [];

  constructor(private readonly userService: UserService) {}

  getAudit() {
    return this.audits;
  }

  getUserAudit(id: number) {
    return this.audits.filter((audit) => audit.userId === id);
  }

  getUsers() {
    return this.userService.getUsers();
  }
}
