import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  error(message: string) {
    console.error(`[${new Date().toISOString()}] ${message}`);
  }

  warn(message: string) {
    console.warn(`[${new Date().toISOString()}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[${new Date().toISOString()}] ${message}`);
  }
}
